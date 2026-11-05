#!/usr/bin/env python3
"""Catalog NOIR iCloud shared albums.

Usage:
  python3 scripts/album_catalog.py LINKS_FILE OUT_DIR [--download images|videos|all] [--limit N]

LINKS_FILE has one iCloud shared-album URL per line (blank lines and # comments
are ignored). Keep it OUT of this repo: the repo is public and a share link
grants access to every photo and video in the album.

Writes OUT_DIR/<album name>/catalog.json (one entry per item: guid, type,
contributor, date, size, caption) and prints a summary per album. With
--download it also saves media into OUT_DIR/<album name>/media/. Videos are
only available as 720p web copies; photos come at their largest shared size.
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request

BASE_HOST = "p23-sharedstreams.icloud.com"


def post(host, token, endpoint, body):
    req = urllib.request.Request(
        f"https://{host}/{token}/sharedstreams/{endpoint}",
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        # 330 means "use another host"; its body names the host.
        if e.code == 330:
            return json.load(e)
        raise


def fetch_album(token):
    data = post(BASE_HOST, token, "webstream", {"streamCtag": None})
    host = data.get("X-Apple-MMe-Host")
    if host:
        data = post(host, token, "webstream", {"streamCtag": None})
    return host or BASE_HOST, data


def token_from_url(url):
    m = re.search(r"#([A-Za-z0-9_-]+)", url)
    if not m:
        raise ValueError(f"not a shared-album link: {url}")
    return m.group(1)


def best_derivative(item):
    ds = item["derivatives"]
    if item.get("mediaAssetType") == "video":
        return ds.get("720p") or ds.get("360p")
    return max(ds.values(), key=lambda d: int(d.get("fileSize", 0)))


def download(host, token, items, dest):
    os.makedirs(dest, exist_ok=True)
    for i in range(0, len(items), 25):
        batch = items[i:i + 25]
        urls = post(host, token, "webasseturls",
                    {"photoGuids": [p["photoGuid"] for p in batch]})["items"]
        for p in batch:
            d = best_derivative(p)
            loc = urls.get(d["checksum"])
            if not loc:
                continue
            ext = ".mp4" if p.get("mediaAssetType") == "video" else ".jpg"
            path = os.path.join(dest, p["dateCreated"].replace(":", "") + "_" + p["photoGuid"][:8] + ext)
            if not os.path.exists(path):
                urllib.request.urlretrieve("https://" + loc["url_location"] + loc["url_path"], path)


def main(argv):
    if len(argv) < 3:
        sys.exit(__doc__)
    links_file, out_dir = argv[1], argv[2]
    mode = argv[argv.index("--download") + 1] if "--download" in argv else None
    limit = int(argv[argv.index("--limit") + 1]) if "--limit" in argv else None

    with open(links_file) as f:
        links = [l.strip() for l in f if l.strip() and not l.lstrip().startswith("#")]

    for url in links:
        token = token_from_url(url)
        host, data = fetch_album(token)
        name = data.get("streamName") or token[:12]
        items = sorted(data.get("photos", []), key=lambda p: p["dateCreated"])
        catalog = [{
            "guid": p["photoGuid"],
            "type": p.get("mediaAssetType", "image"),
            "contributor": p.get("contributorFullName"),
            "date": p["dateCreated"],
            "width": best_derivative(p).get("width"),
            "height": best_derivative(p).get("height"),
            "bytes": int(best_derivative(p).get("fileSize", 0)),
            "caption": p.get("caption") or "",
        } for p in items]

        album_dir = os.path.join(out_dir, re.sub(r"[^\w.-]+", "_", name))
        os.makedirs(album_dir, exist_ok=True)
        with open(os.path.join(album_dir, "catalog.json"), "w") as f:
            json.dump({"album": name, "items": catalog}, f, indent=1)

        n_img = sum(c["type"] == "image" for c in catalog)
        n_vid = len(catalog) - n_img
        gb = sum(c["bytes"] for c in catalog) / 1e9
        span = f"{catalog[0]['date'][:10]} to {catalog[-1]['date'][:10]}" if catalog else "empty"
        print(f"{name}: {n_img} photos, {n_vid} videos, {span}, {gb:.1f} GB")

        if mode:
            wanted = [p for p in items if mode == "all" or
                      (mode == "videos") == (p.get("mediaAssetType") == "video")]
            download(host, token, wanted[:limit], os.path.join(album_dir, "media"))


if __name__ == "__main__":
    main(sys.argv)
