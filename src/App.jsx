import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

async function storageGet(key) {
  const res = await fetch(`/.netlify/functions/storage?key=${encodeURIComponent(key)}`);
  if (!res.ok) throw new Error("Storage read failed");
  const data = await res.json();
  return data.value;
}

async function storageSet(key, value) {
  const res = await fetch(`/.netlify/functions/storage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("Storage write failed");
}

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');`;

const SEED_NEGRIL_GUESTS = [{"name": "Carnisa Allen*", "itinerarySent": false, "email": "travelwithknieci@gmail.com", "phone": "858-736-5148", "arrivalDate": "2027-07-14", "instagram": "@knieci.aye", "roomType": "DLX", "bedding": "1 King", "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": "Anniversary", "dateOfCeleb": "2023-07-06", "referredBy": "Carnisa", "agent": "Carnisa", "insurance": false, "catamaran": false, "atvFarm": false, "sevenMile": false, "clubMobay": false, "netBalance": null, "commission": 0.0, "vaxBalance": 0, "tjBalance": null, "difference": 0, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_ieqh524", "cancelled": false, "price": "", "roomGroup": "Carnisa & Ethan", "primaryTraveler": false, "nights": "5"}, {"name": "Ethan Allen", "itinerarySent": false, "email": "etall1914@gmail.com", "phone": "858-736-5094", "arrivalDate": "2027-07-14", "instagram": "@tooeazy4", "roomType": "DLX", "bedding": "1 King", "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": "Birthday", "dateOfCeleb": "2023-08-02", "referredBy": "Carnisa", "agent": "Carnisa", "insurance": false, "catamaran": false, "atvFarm": false, "sevenMile": false, "clubMobay": false, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_yng5by1", "cancelled": false, "price": "", "roomGroup": "Carnisa & Ethan", "primaryTraveler": false, "nights": "5"}, {"name": "Asia Joyner", "itinerarySent": false, "email": "travelisajoy@gmail.com", "phone": "571-241-9488", "arrivalDate": "2027-07-14", "instagram": "@ayeejoyy", "roomType": "DLX Swim", "bedding": "1 King", "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": "Birthday", "dateOfCeleb": "2023-08-16", "referredBy": "Asia", "agent": "Asia", "insurance": false, "catamaran": false, "atvFarm": false, "sevenMile": false, "clubMobay": false, "netBalance": null, "commission": 0.0, "vaxBalance": 0, "tjBalance": null, "difference": 0, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_a2rogub", "cancelled": false, "price": "", "roomGroup": "Asia & RJ", "primaryTraveler": false, "nights": "5"}, {"name": "RJ Keith ", "itinerarySent": false, "email": "rjkeith10@gmail.com", "phone": null, "arrivalDate": "2027-07-14", "instagram": "  @_h3llboy", "roomType": "DLX Swim", "bedding": "1 King", "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "Asia", "agent": "Asia", "insurance": false, "catamaran": false, "atvFarm": false, "sevenMile": false, "clubMobay": false, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_bb8ayn1", "cancelled": false, "price": "", "roomGroup": "Asia & RJ", "primaryTraveler": false, "nights": "5"}, {"name": "LaQuanda Graham Johnson", "itinerarySent": false, "email": "q4getaways@outlook.com", "phone": "301-221-6631", "arrivalDate": "2027-07-14", "instagram": "@q4getaways", "roomType": "DLX", "bedding": "1 King", "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "LaQuanda", "agent": "LaQuanda", "insurance": false, "catamaran": false, "atvFarm": false, "sevenMile": false, "clubMobay": false, "netBalance": null, "commission": 0.0, "vaxBalance": 0, "tjBalance": 0, "difference": 0, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_b7o259o", "cancelled": false, "price": "", "roomGroup": "LaQuanda & Dale", "primaryTraveler": false, "nights": "5"}, {"name": "Dale Johnson", "itinerarySent": false, "email": "djjohnson2086@yahoo.com", "phone": "301-613-0681", "arrivalDate": "2027-07-14", "instagram": "@thee_andre_price", "roomType": "DLX", "bedding": "1 King", "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": "Birthday", "dateOfCeleb": "2023-08-20", "referredBy": "LaQuanda", "agent": "LaQuanda", "insurance": false, "catamaran": false, "atvFarm": false, "sevenMile": false, "clubMobay": false, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_woo3sb0", "cancelled": false, "price": "", "roomGroup": "LaQuanda & Dale", "primaryTraveler": false, "nights": "5"}, {"name": "Garett Bethea", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-06-30", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": null, "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_16mts56", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Jon Merriweather", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLS", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": true, "celebration": "Birthday", "dateOfCeleb": "2026-06-30", "referredBy": "Ethan", "agent": "Carnisa", "insurance": true, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_zc4pz0l", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "LaMysha Brown", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX Swim", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": true, "celebration": null, "dateOfCeleb": null, "referredBy": "Carnisa", "agent": "Carnisa", "insurance": true, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_x9xf26g", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Apryl Young", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": "Birthday", "dateOfCeleb": "2026-06-10", "referredBy": "Dale", "agent": "LaQuanda", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_k7zx5b4", "cancelled": false, "price": "", "roomGroup": "Apryl & Erik", "primaryTraveler": false, "nights": "5"}, {"name": "Erik Young", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "Dale", "agent": "LaQuanda", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_ctzkk6o", "cancelled": false, "price": "", "roomGroup": "Apryl & Erik", "primaryTraveler": false, "nights": "5"}, {"name": "Ashanti Young-Joiner", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "2 Doubles", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": "LaQuanda", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_am89oz6", "cancelled": false, "price": "", "roomGroup": "Ashanti & Tracy", "primaryTraveler": false, "nights": "5"}, {"name": "Tracy Young", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "2 Doubles", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": "LaQuanda", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_ww3r9ay", "cancelled": false, "price": "", "roomGroup": "Ashanti & Tracy", "primaryTraveler": false, "nights": "5"}, {"name": "Sharonda Gammons", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": "Asia", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_6i79n1d", "cancelled": false, "price": "", "roomGroup": "Sharonda & Damon", "primaryTraveler": false, "nights": "5"}, {"name": "Damon Rush", "itinerarySent": null, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": "Asia", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_4x9m605", "cancelled": false, "price": "", "roomGroup": "Sharonda & Damon", "primaryTraveler": false, "nights": "5"}, {"name": "Tamara Hamilton", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": "Asia", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_w0wa88v", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Demitrious Brown", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "Ethan", "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_3bol9lf", "cancelled": false, "price": "", "roomGroup": "Demitrious & LaKeisha", "primaryTraveler": false, "nights": "5"}, {"name": "Lakeisha Brown", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-01", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "Ethan", "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_9qcefb2", "cancelled": false, "price": "", "roomGroup": "Demitrious & LaKeisha", "primaryTraveler": false, "nights": "5"}, {"name": "Marquis Byrd", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-02", "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "Ethan", "agent": "Carnisa", "insurance": true, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_arprhlw", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Brittany Young", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-02", "bookingNumber": null, "autoPay": true, "celebration": null, "dateOfCeleb": null, "referredBy": null, "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_sekkq7k", "cancelled": false, "price": "", "roomGroup": "Brittany & Marcus", "primaryTraveler": true, "nights": "5"}, {"name": "Marcus Young", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-02", "bookingNumber": null, "autoPay": true, "celebration": "Birthday", "dateOfCeleb": "2026-06-21", "referredBy": "Carnisa", "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_rs3u54h", "cancelled": false, "price": "", "roomGroup": "Brittany & Marcus", "primaryTraveler": false, "nights": "5"}, {"name": "Anthony Richards", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-13", "instagram": null, "roomType": "PLS Swim", "bedding": "1 King", "dateBooked": "2026-07-02", "bookingNumber": null, "autoPay": false, "celebration": "Anniversary", "dateOfCeleb": "2026-06-21", "referredBy": "Carnisa", "agent": "Carnisa", "insurance": true, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_btyv0mq", "cancelled": false, "price": "", "roomGroup": "Anthony & Valerie", "primaryTraveler": false, "nights": "5"}, {"name": "Valerie Richards", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-13", "instagram": null, "roomType": "PLS Swim", "bedding": "1 King", "dateBooked": "2026-07-02", "bookingNumber": null, "autoPay": false, "celebration": "Anniversary", "dateOfCeleb": null, "referredBy": "Carnisa", "agent": "Carnisa", "insurance": true, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_gq6n1bo", "cancelled": false, "price": "", "roomGroup": "Anthony & Valerie", "primaryTraveler": false, "nights": "5"}, {"name": "Brittany Dixon", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-02", "bookingNumber": null, "autoPay": true, "celebration": null, "dateOfCeleb": null, "referredBy": "Brittany/Marcus", "agent": "Carnisa", "insurance": null, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_bzjck26", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Quatease Tann", "itinerarySent": null, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLS Swim", "bedding": "1 King", "dateBooked": "2026-07-03", "bookingNumber": null, "autoPay": null, "celebration": null, "dateOfCeleb": null, "referredBy": "Jasmine", "agent": "Asia", "insurance": null, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_18o72o7", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Jasmine Whitaker", "itinerarySent": null, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLS Swim", "bedding": "1 King", "dateBooked": "2026-07-03", "bookingNumber": null, "autoPay": null, "celebration": "Birthday", "dateOfCeleb": null, "referredBy": "Asia", "agent": "Asia", "insurance": null, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_bzu1dti", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "Anita Sykes", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX Swim", "bedding": "1 King", "dateBooked": "2026-07-04", "bookingNumber": null, "autoPay": null, "celebration": null, "dateOfCeleb": null, "referredBy": "Erik/Apryl", "agent": "LaQuanda", "insurance": null, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_ndteett", "cancelled": false, "price": "", "roomGroup": "Anita & John", "primaryTraveler": false, "nights": "5"}, {"name": "John Sykes", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX Swim", "bedding": "1 King", "dateBooked": "2026-07-04", "bookingNumber": null, "autoPay": null, "celebration": null, "dateOfCeleb": null, "referredBy": "Erik/Apryl", "agent": "LaQuanda", "insurance": true, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_k0qia9c", "cancelled": false, "price": "", "roomGroup": "Anita & John", "primaryTraveler": false, "nights": "5"}, {"name": "Ebony McMurray", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "1 King", "dateBooked": "2026-07-05", "bookingNumber": null, "autoPay": null, "celebration": null, "dateOfCeleb": null, "referredBy": "Jade", "agent": "LaQuanda", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_n3k6cym", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "LaToya Kennedy", "itinerarySent": null, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "DLX", "bedding": "2 Doubles", "dateBooked": "2026-07-05", "bookingNumber": null, "autoPay": null, "celebration": "Graduation", "dateOfCeleb": null, "referredBy": "Carnisa", "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_wgn1m5g", "cancelled": false, "price": "", "roomGroup": "", "primaryTraveler": false, "nights": "5"}, {"name": "William Jackson Jr", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-05", "bookingNumber": null, "autoPay": null, "celebration": null, "dateOfCeleb": null, "referredBy": "LaQuanda", "agent": "LaQuanda", "insurance": null, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_ys65buz", "cancelled": false, "price": "", "roomGroup": "William & Juran", "primaryTraveler": false, "nights": "5"}, {"name": "Juran Johnson", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT", "bedding": "1 King", "dateBooked": "2026-07-05", "bookingNumber": null, "autoPay": null, "celebration": null, "dateOfCeleb": null, "referredBy": "LaQuanda", "agent": "LaQuanda", "insurance": null, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_sbkmuiv", "cancelled": false, "price": "", "roomGroup": "William & Juran", "primaryTraveler": false, "nights": "5"}, {"name": "Jade Williams", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT 2BDRM", "bedding": null, "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": null, "dateOfCeleb": null, "referredBy": "Carnisa", "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_1nrgy9w", "cancelled": false, "price": "", "roomGroup": "Jade & Kiera", "primaryTraveler": false, "nights": "5"}, {"name": "Kiera Smith", "itinerarySent": false, "email": null, "phone": null, "arrivalDate": "2027-07-14", "instagram": null, "roomType": "PLAT 2BDRM", "bedding": null, "dateBooked": null, "bookingNumber": null, "autoPay": false, "celebration": "Birthday", "dateOfCeleb": "2026-07-06", "referredBy": "Carnisa", "agent": "Carnisa", "insurance": false, "catamaran": null, "atvFarm": null, "sevenMile": null, "clubMobay": null, "netBalance": null, "commission": null, "vaxBalance": null, "tjBalance": null, "difference": null, "tjkcDeduction": null, "netCommission": null, "registered": null, "id": "g_858pecf", "cancelled": false, "price": "", "roomGroup": "Jade & Kiera", "primaryTraveler": false, "nights": "5"}];

const RETIRED_GUEST_IDS = ["g_9glshv6"];

const SEED_TRIPS = [
  { id: "t_negril27", name: "NOIR Negril", resort: "Princess Senses The Mangrove", dates: "Jul 14–20, 2027" },
];

const RETIRED_TRIP_IDS = ["t_stlucia26"];

const AGENTS = ["Carnisa", "Asia", "LaQuanda", "Adrienne"];

// Per-person selling rates, rounded to nearest $5, already includes the $250/person markup over contract cost.
// Kept here for reference in case the markup or contract terms change later.
const MARKUP_LINE_ITEMS = [
  { label: "Airport transfers", amount: 60 },
  { label: "Marketing budget", amount: 10 },
  { label: "Gift bags", amount: 50 },
  { label: "Emergency buffer", amount: 50 },
  { label: "Referral fee", amount: 50 },
  { label: "NOIR Night food", amount: 30 },
];
const PER_PERSON_MARKUP = MARKUP_LINE_ITEMS.reduce((s, i) => s + i.amount, 0);
const INSURANCE_COST = 139.99;
const ROOM_RATES = {
  "DLX": { 4: { single: 2460, double: 1655, triple: 1545 }, 5: { single: 3000, double: 1990, triple: 1850 } },
  "PLS": { 4: { single: 2580, double: 1730, triple: null }, 5: { single: 3145, double: 2080, triple: null } },
  "DLX Swim": { 4: { single: 2810, double: 1870, triple: 1740 }, 5: { single: 3430, double: 2260, triple: 2100 } },
  "PLS Swim": { 4: { single: 2925, double: 1945, triple: null }, 5: { single: 3575, double: 2350, triple: null } },
  "PLAT": { 4: { single: 3110, double: 2060, triple: 1915 }, 5: { single: 3810, double: 2500, triple: 2315 } },
};
const OCCUPANCY_LABELS = { 1: "single", 2: "double", 3: "triple" };

// Actual Funjet net cost + commission, keyed by nights, then occupancy ("solo" or "double"), then room type.
// Only 5-night data exists so far — nothing's been booked at 4 nights yet.
const FUNJET_TABLES = {
  5: {
    solo: {
      "DLX": { net: 2322.97, commission: 365.03 },
      "DLX Swim": { net: 2696.30, commission: 423.70 },
      "PLS": { net: 2447.41, commission: 384.59 },
      "PLS Swim": { net: 2820.75, commission: 443.25 },
      "PLAT": { net: 3022.65, commission: 474.98 },
    },
    double: {
      "DLX": { net: 2903.71, commission: 456.29 },
      "DLX Swim": { net: 3370.38, commission: 529.62 },
      "PLS": { net: 3059.27, commission: 480.73 },
      "PLS Swim": { net: 3525.94, commission: 554.06 },
      "PLAT": { net: 3897.48, commission: 606.52 },
    },
  },
};

function getFunjetRate(nights, occupancyKey, roomType) {
  const table = FUNJET_TABLES[Number(nights)];
  if (!table || !occupancyKey) return null;
  return table[occupancyKey]?.[roomType] || null;
}

const EXCLUDED_REFERRERS = ["Carnisa", "Ethan", "Asia", "LaQuanda", "Dale", "RJ"];

// Base room block held with the resort, plus any rooms requested on top of that block.
const ROOM_INVENTORY_BASE = { "DLX": 8, "PLAT": 8, "PLS": 7, "DLX Swim": 3, "PLS Swim": 3 };
const ROOM_INVENTORY_ON_REQUEST = { "PLS Swim": 1, "PLAT 2BDRM": 1, "DLX": 10, "DLX Swim": 6 };
const ROOM_TYPE_ORDER = ["DLX", "PLAT", "PLS", "DLX Swim", "PLS Swim", "PLAT 2BDRM"];

// Fraction of commission each agent keeps; the rest is the TJKC split.
// Adrienne's split isn't confirmed yet, so she's intentionally left out.
// Rooms with no agent attributed ("Free Agent") don't follow a split at all —
// that commission transfers into the markup pool instead.
const AGENT_SPLIT_RATES = { Carnisa: 1, Asia: 0.8, LaQuanda: 0.8 };

function getRoomPrimaryAgent(guestsInRoom) {
  const primary = guestsInRoom.find((g) => g.primaryTraveler && g.agent);
  if (primary) return primary.agent;
  const anyAgent = guestsInRoom.find((g) => g.agent);
  return anyAgent ? anyAgent.agent : null;
}

const ADDONS = [
  { key: "catamaran", label: "Catamaran" },
  { key: "atvFarm", label: "ATV Farm" },
  { key: "sevenMile", label: "7 Mile" },
  { key: "clubMobay", label: "Club Mobay" },
];

const emptyGuest = () => ({
  id: "g_" + Math.random().toString(36).slice(2, 9),
  name: "",
  gender: "",
  travelStatus: "",
  ageRange: "",
  nights: "",
  instagram: "",
  email: "",
  phone: "",
  arrivalDate: "",
  roomType: "",
  bedding: "",
  dateBooked: "",
  bookingNumber: "",
  autoPay: false,
  celebration: "",
  dateOfCeleb: "",
  referredBy: "",
  agent: "",
  insurance: false,
  itinerarySent: false,
  registered: false,
  catamaran: false,
  atvFarm: false,
  sevenMile: false,
  clubMobay: false,
  netBalance: "",
  commission: "",
  vaxBalance: "",
  tjBalance: "",
  difference: "",
  tjkcDeduction: "",
  netCommission: "",
  price: "",
  roomGroup: "",
  primaryTraveler: false,
  cancelled: false,
});

function money(n) {
  if (n === null || n === undefined || n === "") return "—";
  const v = Number(n);
  if (Number.isNaN(v)) return "—";
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d + "T00:00:00");
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function NoirBookingManifest() {
  const [trips, setTrips] = useState(null);
  const [activeTripId, setActiveTripId] = useState(null);
  const [roster, setRoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTripForm, setShowTripForm] = useState(false);
  const [tripDraft, setTripDraft] = useState({ name: "", resort: "", dates: "" });
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestDraft, setGuestDraft] = useState(emptyGuest());
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("active");
  const [agentFilter, setAgentFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [activePage, setActivePage] = useState("roster");
  const [saving, setSaving] = useState(false);
  const [showMoreStats, setShowMoreStats] = useState(false);
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false);
  const [showReferralBreakdown, setShowReferralBreakdown] = useState(false);
  const [addonOpenKey, setAddonOpenKey] = useState(null);
  const [showAutoPayBreakdown, setShowAutoPayBreakdown] = useState(false);
  const [showCancelledBreakdown, setShowCancelledBreakdown] = useState(false);
  const [showKingBreakdown, setShowKingBreakdown] = useState(false);
  const [showDoublesBreakdown, setShowDoublesBreakdown] = useState(false);
  const [expandedReferrer, setExpandedReferrer] = useState(null);
  const [demoOpenKey, setDemoOpenKey] = useState(null);
  const [showGuestsByAgent, setShowGuestsByAgent] = useState(false);
  const [showSetDemographics, setShowSetDemographics] = useState(false);

  useEffect(() => {
    (async () => {
      let t;
      let hadStoredTrips = false;
      try {
        const val = await storageGet("trips");
        t = val ? JSON.parse(val) : null;
        hadStoredTrips = !!val;
      } catch {
        t = null;
      }
      if (!t || t.length === 0) {
        t = SEED_TRIPS;
      }
      const filtered = t.filter((tr) => !RETIRED_TRIP_IDS.includes(tr.id));
      const finalTrips = filtered.length ? filtered : SEED_TRIPS;
      // Show trips immediately regardless of whether the save below succeeds.
      setTrips(finalTrips);
      setActiveTripId(finalTrips[0].id);
      setLoading(false);
      if (filtered.length !== t.length || !hadStoredTrips) {
        try {
          await storageSet("trips", JSON.stringify(finalTrips));
        } catch {
          // Read-only session — data above is already showing, it just won't persist.
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeTripId) return;
    (async () => {
      let res = null;
      try {
        res = await storageGet("roster:" + activeTripId);
      } catch {
        res = null;
      }
      let finalRoster = [];
      let needsSave = false;
      try {
        if (res) {
          let loaded = JSON.parse(res);
          if (activeTripId === "t_negril27") {
            let changed = false;
            const beforeCount = loaded.length;
            loaded = loaded.filter((g) => !RETIRED_GUEST_IDS.includes(g.id));
            if (loaded.length !== beforeCount) changed = true;
            loaded = loaded.map((g) => {
              const seedMatch = SEED_NEGRIL_GUESTS.find((sg) => sg.id === g.id);
              if (!seedMatch) return g;
              let next = g;
              if ((!g.roomGroup || !g.roomGroup.trim()) && seedMatch.roomGroup) {
                changed = true;
                next = { ...next, roomGroup: seedMatch.roomGroup };
              }
              if (!next.agent && seedMatch.agent) {
                changed = true;
                next = { ...next, agent: seedMatch.agent };
              }
              if (!next.nights && seedMatch.nights) {
                changed = true;
                next = { ...next, nights: seedMatch.nights };
              }
              if (!next.primaryTraveler && seedMatch.primaryTraveler) {
                changed = true;
                next = { ...next, primaryTraveler: seedMatch.primaryTraveler };
              }
              return next;
            });
            needsSave = changed;
          }
          finalRoster = loaded;
        } else if (activeTripId === "t_negril27") {
          finalRoster = SEED_NEGRIL_GUESTS;
          needsSave = true;
        } else {
          finalRoster = [];
        }
      } catch {
        // Parsing/backfill failed — fall back to the seed data rather than showing nothing.
        finalRoster = activeTripId === "t_negril27" ? SEED_NEGRIL_GUESTS : [];
      }
      // Always show the best data we have, whether or not it's actually saved.
      setRoster(syncRoomFinancials(finalRoster));
      if (needsSave) {
        try {
          await storageSet("roster:" + activeTripId, JSON.stringify(finalRoster));
        } catch {
          // Read-only session (e.g. viewing a shared link without write access) — that's fine,
          // the data above is already showing; it just won't persist this particular update.
        }
      }
    })();
  }, [activeTripId]);

  function syncRoomFinancials(list) {
    const groups = new Map();
    list.forEach((g) => {
      if (g.cancelled) return;
      const key = (g.roomGroup && g.roomGroup.trim()) || "solo:" + g.id;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(g);
    });
    const roomInfo = new Map();
    groups.forEach((guestsInRoom, key) => {
      const price = guestsInRoom.reduce(
        (s, g) => s + (Number(g.price) || 0) + (g.insurance ? INSURANCE_COST : 0),
        0
      );
      const occupancyKey = guestsInRoom.length === 1 ? "solo" : guestsInRoom.length === 2 ? "double" : null;
      const nights = guestsInRoom[0]?.nights;
      const roomType = guestsInRoom[0]?.roomType;
      const hasRate = guestsInRoom.some((g) => Number(g.price) > 0);
      const funjet = hasRate && nights ? getFunjetRate(nights, occupancyKey, roomType) : null;
      const manualCommission = Number(guestsInRoom[0]?.commission) || 0;
      const commission = funjet ? funjet.commission : manualCommission;
      const primaryAgent = getRoomPrimaryAgent(guestsInRoom);
      const insuredCost = guestsInRoom.reduce((s, g) => s + (g.insurance ? INSURANCE_COST : 0), 0);
      roomInfo.set(key, {
        price,
        commission,
        primaryAgent,
        funjetNet: funjet ? funjet.net : null,
        autoMatched: !!funjet,
        insuredCost,
      });
    });
    return list.map((g) => {
      if (g.cancelled) return g;
      const key = (g.roomGroup && g.roomGroup.trim()) || "solo:" + g.id;
      const info = roomInfo.get(key);
      if (!info) return g;
      let tjkcDeduction = g.tjkcDeduction;
      let netCommission = g.netCommission;
      let netBalance = g.netBalance;
      let vaxBalance = g.vaxBalance;
      if (info.funjetNet !== null) {
        netBalance = info.funjetNet;
        vaxBalance = Math.round((info.funjetNet + info.insuredCost + info.commission) * 100) / 100;
      }
      if (info.primaryAgent === "Adrienne") {
        // Split unconfirmed — leave whatever's there untouched rather than guessing.
      } else if (!info.primaryAgent) {
        // No agent attributed: commission transfers to the markup pool, not a personal split.
        tjkcDeduction = 0;
        netCommission = 0;
      } else if (typeof AGENT_SPLIT_RATES[info.primaryAgent] === "number") {
        const rate = AGENT_SPLIT_RATES[info.primaryAgent];
        tjkcDeduction = Math.round(info.commission * (1 - rate) * 100) / 100;
        netCommission = Math.round(info.commission * rate * 100) / 100;
      }
      const difference =
        info.funjetNet !== null ? Math.round((info.price - vaxBalance) * 100) / 100 : g.difference;
      return { ...g, tjBalance: info.price, commission: info.commission, tjkcDeduction, netCommission, netBalance, vaxBalance, difference };
    });
  }

  async function saveRoster(next) {
    const synced = syncRoomFinancials(next);
    setRoster(synced);
    setSaving(true);
    try {
      await storageSet("roster:" + activeTripId, JSON.stringify(synced));
    } catch {
      setError("Save failed — your last change may not have synced.");
    } finally {
      setSaving(false);
    }
  }

  async function saveTrips(next) {
    setTrips(next);
    try {
      await storageSet("trips", JSON.stringify(next));
    } catch {
      setError("Couldn't save trip list.");
    }
  }

  const activeTrip = trips?.find((t) => t.id === activeTripId);

  const agentsInRoster = useMemo(() => {
    if (!roster) return [];
    const set = new Set(roster.map((g) => g.agent).filter(Boolean));
    return Array.from(set).sort();
  }, [roster]);

  const stats = useMemo(() => {
    if (!roster) return null;
    const active = roster.filter((g) => !g.cancelled);
    const registered = active.filter((g) => g.registered).length;
    const autoPayGuests = active.filter((g) => g.autoPay);
    const autoPayCount = autoPayGuests.length;
    const autoPayNames = autoPayGuests.map((g) => g.name);
    const referralMap = new Map();
    active.forEach((g) => {
      const ref = g.referredBy && g.referredBy.trim();
      if (!ref || EXCLUDED_REFERRERS.includes(ref)) return;
      if (!referralMap.has(ref)) referralMap.set(ref, []);
      referralMap.get(ref).push(g.name);
    });
    const referralCount = Array.from(referralMap.values()).reduce((s, list) => s + list.length, 0);
    const outstanding = active.reduce((s, g) => s + (Number(g.netBalance) || 0), 0);
    const roomRevenue = active.reduce((s, g) => s + (Number(g.price) || 0), 0);
    const insuredCount = active.filter((g) => g.insurance).length;
    const insuranceRevenue = insuredCount * INSURANCE_COST;
    const revenue = roomRevenue + insuranceRevenue;
    const roomMap = new Map();
    active.forEach((g) => {
      const key = (g.roomGroup && g.roomGroup.trim()) || "solo:" + g.id;
      if (!roomMap.has(key)) roomMap.set(key, []);
      roomMap.get(key).push(g);
    });
    const menCount = active.filter((g) => g.gender === "M").length;
    const womenCount = active.filter((g) => g.gender === "F").length;
    const ageCounts = {
      "18-29": active.filter((g) => g.ageRange === "18-29").length,
      "30-49": active.filter((g) => g.ageRange === "30-49").length,
      "50+": active.filter((g) => g.ageRange === "50+").length,
    };
    const travelStatusCounts = {
      Couple: active.filter((g) => g.travelStatus === "Couple").length,
      Single: active.filter((g) => g.travelStatus === "Single").length,
    };
    let couplesCount = 0;
    let singleMen = 0;
    let singleWomen = 0;
    const couplesNames = [];
    const singleMenNames = [];
    const singleWomenNames = [];
    roomMap.forEach((guestsInRoom) => {
      const hasStatus = guestsInRoom.some((g) => g.travelStatus);
      const isCouple = hasStatus
        ? guestsInRoom.some((g) => g.travelStatus === "Couple")
        : guestsInRoom.length === 2;
      if (isCouple) {
        couplesCount += 1;
        couplesNames.push(guestsInRoom.map((g) => g.name).join(" & "));
      } else {
        guestsInRoom.forEach((g) => {
          const isSingle = g.travelStatus ? g.travelStatus === "Single" : guestsInRoom.length === 1;
          if (!isSingle) return;
          if (g.gender === "M") {
            singleMen += 1;
            singleMenNames.push(g.name);
          } else if (g.gender === "F") {
            singleWomen += 1;
            singleWomenNames.push(g.name);
          }
        });
      }
    });
    const menNames = active.filter((g) => g.gender === "M").map((g) => g.name);
    const womenNames = active.filter((g) => g.gender === "F").map((g) => g.name);
    const ageNames = {
      "18-29": active.filter((g) => g.ageRange === "18-29").map((g) => g.name),
      "30-49": active.filter((g) => g.ageRange === "30-49").map((g) => g.name),
      "50+": active.filter((g) => g.ageRange === "50+").map((g) => g.name),
    };
    const celebrationMap = new Map();
    active.forEach((g) => {
      const c = g.celebration && g.celebration.trim();
      if (!c) return;
      if (!celebrationMap.has(c)) celebrationMap.set(c, []);
      celebrationMap.get(c).push({ name: g.name, date: g.dateOfCeleb });
    });
    const agentGuestCounts = {};
    AGENTS.forEach((a) => {
      agentGuestCounts[a] = 0;
    });
    agentGuestCounts["Free Agent"] = 0;
    active.forEach((g) => {
      const a = g.agent || "Free Agent";
      agentGuestCounts[a] = (agentGuestCounts[a] || 0) + 1;
    });
    const agentRoomCounts = {};
    const agentCommissionTotals = {};
    const agentPricedRoomCounts = {};
    let totalPricedRooms = 0;
    let funjetActualCost = 0;
    let funjetMatchedRooms = 0;
    let funjetUnmatchedRooms = 0;
    let markupPoolFromFreeAgents = 0;
    AGENTS.forEach((a) => {
      agentRoomCounts[a] = 0;
      agentCommissionTotals[a] = { commission: 0, tjkcDeduction: 0 };
      agentPricedRoomCounts[a] = 0;
    });
    agentPricedRoomCounts["Free Agent"] = 0;
    let totalCommission = 0;
    let agentsKeepTotal = 0;
    let tjkcTotal = 0;
    let unconfirmedTotal = 0;
    const beddingCounts = { "1 King": 0, "2 Doubles": 0, other: 0 };
    const beddingRoomNames = { "1 King": [], "2 Doubles": [] };
    const roomTypeCounts = {};
    roomMap.forEach((guestsInRoom) => {
      const roomType = guestsInRoom[0]?.roomType || "Unspecified";
      roomTypeCounts[roomType] = (roomTypeCounts[roomType] || 0) + 1;
      const bedding = guestsInRoom[0]?.bedding;
      const roomLabel = guestsInRoom.map((g) => g.name).join(" & ");
      if (bedding === "1 King") {
        beddingCounts["1 King"] += 1;
        beddingRoomNames["1 King"].push(roomLabel);
      } else if (bedding === "2 Doubles") {
        beddingCounts["2 Doubles"] += 1;
        beddingRoomNames["2 Doubles"].push(roomLabel);
      } else {
        beddingCounts.other += 1;
      }
      const primary = guestsInRoom.find((g) => g.primaryTraveler && g.agent);
      const roomAgents = primary
        ? [primary.agent]
        : Array.from(new Set(guestsInRoom.map((g) => g.agent).filter(Boolean)));
      const roomCommission = Number(guestsInRoom[0]?.commission) || 0;
      const primaryAgent = getRoomPrimaryAgent(guestsInRoom);
      let roomTjkcDeduction = 0;
      if (primaryAgent && typeof AGENT_SPLIT_RATES[primaryAgent] === "number") {
        roomTjkcDeduction = roomCommission * (1 - AGENT_SPLIT_RATES[primaryAgent]);
      }
      totalCommission += roomCommission;
      if (roomAgents.length === 0) {
        agentRoomCounts["Free Agent"] = (agentRoomCounts["Free Agent"] || 0) + 1;
        if (!agentCommissionTotals["Free Agent"]) agentCommissionTotals["Free Agent"] = { commission: 0, tjkcDeduction: 0 };
        agentCommissionTotals["Free Agent"].commission += roomCommission;
        markupPoolFromFreeAgents += roomCommission;
      } else {
        roomAgents.forEach((a) => {
          agentRoomCounts[a] = (agentRoomCounts[a] || 0) + 1;
          if (!agentCommissionTotals[a]) agentCommissionTotals[a] = { commission: 0, tjkcDeduction: 0 };
          agentCommissionTotals[a].commission += roomCommission;
          agentCommissionTotals[a].tjkcDeduction += a === primaryAgent ? roomTjkcDeduction : 0;
        });
        if (primaryAgent === "Adrienne") {
          unconfirmedTotal += roomCommission;
        } else if (primaryAgent && typeof AGENT_SPLIT_RATES[primaryAgent] === "number") {
          agentsKeepTotal += roomCommission * AGENT_SPLIT_RATES[primaryAgent];
          tjkcTotal += roomTjkcDeduction;
        }
      }
      const roomPrice = guestsInRoom.reduce((s, g) => s + (Number(g.price) || 0), 0);
      if (roomPrice > 0) {
        totalPricedRooms += 1;
        const stakeAgent = primaryAgent || "Free Agent";
        agentPricedRoomCounts[stakeAgent] = (agentPricedRoomCounts[stakeAgent] || 0) + 1;
      }
      const occKey = guestsInRoom.length === 1 ? "solo" : guestsInRoom.length === 2 ? "double" : null;
      const roomNights = guestsInRoom[0]?.nights;
      const funjetMatch = roomPrice > 0 && roomNights ? getFunjetRate(roomNights, occKey, guestsInRoom[0]?.roomType) : null;
      if (funjetMatch) {
        funjetActualCost += funjetMatch.net;
        funjetMatchedRooms += 1;
      } else if (roomPrice > 0) {
        funjetUnmatchedRooms += 1;
      }
    });
    const addonCounts = {};
    const addonNames = {};
    ADDONS.forEach((a) => {
      const withAddon = active.filter((g) => g[a.key]);
      addonCounts[a.key] = withAddon.length;
      addonNames[a.key] = withAddon.map((g) => g.name);
    });
    const guestsWithRate = active.filter((g) => Number(g.price) > 0).length;
    const markupPoolFromGuests = PER_PERSON_MARKUP * guestsWithRate;
    const totalMarkupPool = markupPoolFromGuests + markupPoolFromFreeAgents;
    return {
      count: active.length,
      guestsWithRate,
      rooms: roomMap.size,
      revenue,
      registered,
      menCount,
      womenCount,
      ageCounts,
      travelStatusCounts,
      couplesCount,
      couplesNames,
      singleMen,
      singleMenNames,
      singleWomen,
      singleWomenNames,
      menNames,
      womenNames,
      ageNames,
      celebrationMap,
      autoPayCount,
      autoPayNames,
      referralCount,
      referralMap,
      beddingCounts,
      beddingRoomNames,
      roomTypeCounts,
      outstanding,
      addonCounts,
      addonNames,
      agentGuestCounts,
      agentRoomCounts,
      agentCommissionTotals,
      agentPricedRoomCounts,
      totalPricedRooms,
      markupPoolFromFreeAgents,
      totalMarkupPool,
      revenueBreakdown: {
        vendorCost: roomRevenue - totalCommission,
        funjetActualCost,
        funjetMatchedRooms,
        funjetUnmatchedRooms,
        totalCommission,
        agentsKeepTotal,
        tjkcTotal,
        markupPoolFromGuests,
        markupPoolFromFreeAgents,
        totalMarkupPool,
        unconfirmedTotal,
        insuranceRevenue,
        insuredCount,
      },
      cancelledCount: roster.length - active.length,
      cancelledNames: roster.filter((g) => g.cancelled).map((g) => g.name),
    };
  }, [roster]);

  const visibleRoster = useMemo(() => {
    if (!roster) return [];
    let list = roster;
    if (filter === "active") list = list.filter((g) => !g.cancelled);
    if (filter === "cancelled") list = list.filter((g) => g.cancelled);
    if (agentFilter === "Free Agent") list = list.filter((g) => !g.agent);
    else if (agentFilter !== "all") list = list.filter((g) => g.agent === agentFilter);
    if (roomTypeFilter !== "all") {
      list = list.filter((g) => (g.roomType || "Unspecified") === roomTypeFilter);
    }
    return list;
  }, [roster, filter, agentFilter, roomTypeFilter]);

  const groupedRooms = useMemo(() => {
    const map = new Map();
    const order = [];
    visibleRoster.forEach((g) => {
      const key = (g.roomGroup && g.roomGroup.trim()) || "solo:" + g.id;
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key).push(g);
    });
    return order.map((key) => ({ key, guests: map.get(key) }));
  }, [visibleRoster]);

  function openAddTrip() {
    setTripDraft({ name: "", resort: "", dates: "" });
    setShowTripForm(true);
  }

  async function submitTrip(e) {
    e.preventDefault();
    if (!tripDraft.name.trim()) return;
    const id = "t_" + Math.random().toString(36).slice(2, 9);
    const next = [...(trips || []), { id, ...tripDraft }];
    await saveTrips(next);
    setActiveTripId(id);
    setShowTripForm(false);
  }

  function openAddGuest() {
    setEditingId(null);
    setGuestDraft(emptyGuest());
    setShowGuestForm(true);
  }

  function openEditGuest(g) {
    setEditingId(g.id);
    setGuestDraft({ ...g });
    setShowGuestForm(true);
  }

  async function submitGuest(e) {
    e.preventDefault();
    if (!guestDraft.name.trim()) return;
    let next;
    if (editingId) {
      next = roster.map((g) => (g.id === editingId ? guestDraft : g));
    } else {
      next = [...roster, guestDraft];
    }
    await saveRoster(next);
    setShowGuestForm(false);
  }

  async function toggleCancelled(g) {
    const next = roster.map((r) => (r.id === g.id ? { ...r, cancelled: !r.cancelled } : r));
    await saveRoster(next);
  }

  async function deleteGuest(g) {
    const next = roster.filter((r) => r.id !== g.id);
    await saveRoster(next);
  }

  function field(label, value, onChange, type) {
    return (
      <div className="noir-field">
        <label>{label}</label>
        <input
          type={type || "text"}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="noir-root">
      <style>{`
        ${FONT_IMPORT}
        .noir-root {
          --bg: #f7f2e7;
          --surface: #ffffff;
          --panel: #111111;
          --panel2: #1c1c1c;
          --line: #3a3a3a;
          --text: #111111;
          --muted: #6b6b6b;
          --text-inverse: #ffffff;
          --muted-inverse: #9a9a9a;
          --accent: #111111;
          --accent-inverse: #ffffff;
          --ok: #6b9271;
          --warn: #b8843a;
          --bad: #a15b52;
          font-family: 'IBM Plex Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 600px;
          border-radius: 14px;
          display: flex;
          overflow: hidden;
          border: 1px solid var(--line);
        }
        .noir-root * { box-sizing: border-box; }
        .noir-sidebar {
          width: 210px;
          flex-shrink: 0;
          background: var(--panel);
          border-right: 1px solid var(--line);
          padding: 22px 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .noir-brand {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          letter-spacing: 0.04em;
          font-weight: 600;
          margin-bottom: 2px;
          color: var(--text-inverse);
        }
        .noir-brand span { color: var(--accent-inverse); }
        .noir-brandsub {
          font-size: 11px;
          color: var(--muted-inverse);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }
        .noir-triplist { display: flex; flex-direction: column; gap: 2px; flex: 1; overflow-y: auto; }
        .noir-tripbtn {
          text-align: left;
          background: transparent;
          border: 1px solid transparent;
          color: var(--muted-inverse);
          padding: 10px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .noir-tripbtn .tname { display: block; color: var(--text-inverse); font-size: 13.5px; font-weight: 500; }
        .noir-tripbtn .tdates { display: block; font-size: 11px; color: var(--muted-inverse); margin-top: 2px; }
        .noir-tripbtn:hover { background: var(--panel2); }
        .noir-tripbtn.active { background: var(--panel2); border-color: var(--line); }
        .noir-tripbtn.active .tname { color: var(--accent-inverse); }
        .noir-subnav { display: flex; flex-direction: column; gap: 1px; margin: 2px 0 6px 14px; }
        .noir-subnavitem {
          text-align: left; background: transparent; border: none; color: var(--muted-inverse);
          padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12.5px;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .noir-subnavitem:hover { background: var(--panel2); color: var(--text-inverse); }
        .noir-subnavitem.active { background: var(--panel2); color: var(--accent-inverse); font-weight: 500; }
        .noir-addtrip {
          margin-top: 10px;
          background: transparent;
          border: 1px dashed var(--line);
          color: var(--muted-inverse);
          border-radius: 8px;
          padding: 9px;
          font-size: 12.5px;
          cursor: pointer;
        }
        .noir-addtrip:hover { color: var(--accent-inverse); border-color: var(--accent-inverse); }
        .noir-main { flex: 1; padding: 22px 26px; overflow-y: auto; }
        .noir-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
        .noir-tripname { font-family: 'Fraunces', serif; font-size: 25px; font-weight: 600; }
        .noir-tripmeta { color: var(--muted); font-size: 13px; margin-top: 4px; }
        .noir-savingtag { font-size: 11px; color: var(--muted); }
        .noir-btn {
          background: var(--accent);
          color: var(--accent-inverse);
          border: none;
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .noir-btn:hover { filter: brightness(1.08); }
        .noir-btn.ghost {
          background: transparent;
          color: var(--text-inverse);
          border: 1px solid var(--line);
        }
        .noir-btn.ghost.noir-morebtn {
          color: var(--text);
          border-color: var(--line);
        }
        .noir-stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 18px; }
        .noir-stats-primary { grid-template-columns: repeat(3, 1fr) auto; align-items: stretch; }
        .noir-stats-secondary { grid-template-columns: repeat(4, 1fr); }
        .noir-morebtn { white-space: nowrap; align-self: center; }
        .noir-agentblock { margin-bottom: 18px; }
        .noir-breakdownbar {
          display: flex; height: 14px; border-radius: 7px; overflow: hidden;
          background: var(--line); margin-bottom: 10px;
        }
        .noir-breakdownseg { min-width: 2px; }
        .noir-breakdownlegend { display: flex; flex-wrap: wrap; gap: 14px; margin-bottom: 6px; }
        .noir-breakdownitem { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 6px; }
        .noir-breakdownitem strong { color: var(--text); font-family: 'IBM Plex Mono', monospace; font-weight: 500; }
        .noir-breakdowndot { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }
        .seg-vendor { background: #4a4a4a; }
        .seg-agent { background: #111111; }
        .seg-tjkc { background: #8a8a8a; }
        .seg-markup { background: #b8843a; }
        .seg-unconfirmed { background: #c9c2b0; }
        .seg-insurance { background: #6b8f96; }
        .noir-markupitems { margin: 10px 0; padding: 10px 12px; background: var(--panel); border-radius: 8px; }
        .noir-markupitem {
          display: flex; justify-content: space-between; font-size: 12.5px;
          color: var(--muted-inverse); padding: 3px 0;
        }
        .noir-markupitem .noir-money { color: var(--text-inverse); }
        .noir-referrerlist { display: flex; flex-direction: column; gap: 4px; }
        .noir-referrerrow { border: 1px solid var(--line); border-radius: 8px; background: var(--panel); overflow: hidden; }
        .noir-referrerbtn {
          width: 100%; display: flex; justify-content: space-between; align-items: center;
          background: none; border: none; padding: 10px 14px; cursor: pointer;
          color: var(--text-inverse); font-family: 'IBM Plex Sans', sans-serif; font-size: 13.5px;
        }
        .noir-referrerbtn:hover { background: var(--panel2); }
        .noir-referrercount {
          font-family: 'IBM Plex Mono', monospace; color: var(--muted-inverse); font-size: 12.5px;
        }
        .noir-referredlist { padding: 4px 14px 12px 14px; border-top: 1px solid var(--line); }
        .noir-referreditem { font-size: 12.5px; color: var(--muted-inverse); padding: 4px 0; }
        .noir-piecard {
          background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
          padding: 18px 20px; margin-bottom: 0; flex: 1; min-width: 280px;
        }
        .noir-demosplit { display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-start; }
        .noir-demosplit .noir-agentblock { flex: 1; min-width: 280px; }
        .noir-donutrow { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        .noir-donutrow .noir-piecard { flex: 1; min-width: 260px; margin-bottom: 0; }
        .noir-demotable { border-radius: 10px; overflow: hidden; }
        .noir-demotablehead {
          display: grid; grid-template-columns: 1.4fr 1.4fr 1.6fr 2fr; gap: 8px;
          background: var(--panel2); color: var(--muted-inverse); font-size: 10.5px;
          text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 14px;
          border: 1px solid var(--line); border-bottom: none; border-radius: 10px 10px 0 0;
        }
        .noir-demotablerow {
          display: grid; grid-template-columns: 1.4fr 1.4fr 1.6fr 2fr; gap: 8px; align-items: center;
          padding: 8px 14px; border-bottom: 1px dashed var(--line);
        }
        .noir-demotablerow:last-child { border-bottom: none; }
        .noir-demoname { font-size: 13px; color: var(--text-inverse); }
        .noir-piecard .noir-breakdownitem strong { color: var(--text-inverse); }
        .noir-piecard .noir-breakdownitem { color: var(--muted-inverse); }
        .noir-genderlist {
          max-height: 340px; overflow-y: auto; background: var(--panel); border-radius: 10px;
          border: 1px solid var(--line);
        }
        .noir-genderrow {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 14px; border-bottom: 1px dashed var(--line); font-size: 13px; color: var(--text-inverse);
        }
        .noir-genderrow:last-child { border-bottom: none; }
        .noir-gendertoggle { display: flex; gap: 6px; }
        .noir-gendertoggle button {
          background: transparent; border: 1px solid var(--line); color: var(--muted-inverse);
          border-radius: 14px; padding: 3px 11px; font-size: 11.5px; cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .noir-gendertoggle button.active { border-color: var(--accent-inverse); color: var(--accent-inverse); }
        .noir-gendertoggle button:hover { border-color: var(--muted-inverse); }
        .noir-blocklabel { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); margin-bottom: 8px; }
        .noir-agentcards { display: flex; gap: 10px; flex-wrap: wrap; }
        .noir-agentcard {
          background: var(--panel); border: 1px solid var(--line); border-radius: 10px;
          padding: 10px 16px; min-width: 92px; cursor: pointer; text-align: left;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .noir-agentcard:hover { border-color: var(--muted-inverse); }
        .noir-agentcard.active { border-color: var(--accent-inverse); box-shadow: inset 0 0 0 1px var(--accent-inverse); }
        .noir-statcard {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 10px;
          padding: 12px 14px;
        }
        .noir-statcard-clickable {
          cursor: pointer; text-align: left; font-family: 'IBM Plex Sans', sans-serif;
        }
        .noir-statcard-clickable:hover { border-color: var(--muted-inverse); }
        .noir-statcard-clickable.active { border-color: var(--accent-inverse); box-shadow: inset 0 0 0 1px var(--accent-inverse); }
        .noir-statlabel { font-size: 10.5px; color: var(--muted-inverse); text-transform: uppercase; letter-spacing: 0.06em; }
        .noir-statval { font-family: 'IBM Plex Mono', monospace; font-size: 19px; margin-top: 6px; color: var(--text-inverse); }
        .noir-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
        .noir-filters { display: flex; gap: 6px; flex-wrap: wrap; }
        .noir-filterbtn {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--muted);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
        }
        .noir-filterbtn.active { border-color: var(--accent); color: var(--accent); }
        .noir-select {
          background: var(--panel); border: 1px solid var(--line); color: var(--text-inverse);
          border-radius: 20px; padding: 6px 10px; font-size: 12px;
        }
        table.noir-table { width: 100%; border-collapse: collapse; }
        .noir-table th {
          text-align: left;
          font-size: 10.5px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--muted);
          font-weight: 500;
          padding: 8px 9px;
          border-bottom: 1px solid var(--line);
        }
        .noir-table td {
          padding: 10px 9px;
          border-bottom: 1px dashed var(--line);
          font-size: 13px;
          vertical-align: middle;
        }
        .noir-table tr.is-cancelled td { color: var(--muted); text-decoration: line-through; opacity: 0.6; }
        .noir-roomguest { display: flex; align-items: center; gap: 7px; padding: 2px 0; }
        .noir-roomguest.is-cancelled { text-decoration: line-through; opacity: 0.6; }
        .noir-roomguest.is-cancelled .noir-guestlink { color: var(--muted); }
        .noir-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .noir-guestlink {
          background: none; border: none; padding: 0; margin: 0;
          color: var(--text); font-family: 'IBM Plex Sans', sans-serif; font-size: 13.5px;
          font-weight: 500; cursor: pointer; text-align: left;
        }
        .noir-guestlink:hover { color: var(--accent); text-decoration: underline; }
        .noir-name { font-weight: 500; }
        .noir-sub { color: var(--muted); font-size: 11.5px; }
        .noir-money { font-family: 'IBM Plex Mono', monospace; }
        .noir-pill {
          display: inline-block;
          font-size: 10.5px;
          padding: 2px 8px;
          border-radius: 20px;
          border: 1px solid currentColor;
        }
        .noir-addons { display: flex; gap: 4px; flex-wrap: wrap; }
        .noir-addonchip {
          font-size: 10px; padding: 2px 6px; border-radius: 5px;
          background: var(--panel2); color: var(--muted); border: 1px solid var(--line);
        }
        .noir-addonchip.on { color: var(--accent-inverse); border-color: var(--accent-inverse); }
        .noir-rowactions { display: flex; gap: 6px; }
        .noir-iconbtn {
          background: transparent;
          border: 1px solid var(--line);
          color: var(--muted);
          border-radius: 6px;
          padding: 4px 9px;
          font-size: 11px;
          cursor: pointer;
        }
        .noir-iconbtn:hover { color: var(--text); border-color: var(--accent); }
        .noir-empty { color: var(--muted); font-size: 13.5px; padding: 30px 0; text-align: center; }
        .noir-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center; z-index: 10;
          padding: 20px;
        }
        .noir-modal {
          background: var(--panel); border: 1px solid var(--line); border-radius: 12px;
          padding: 22px; width: 620px; max-width: 100%; max-height: 85vh; overflow-y: auto;
        }
        .noir-modal h3 { font-family: 'Fraunces', serif; font-size: 18px; margin: 0 0 14px; color: var(--text-inverse); }
        .noir-section { margin-bottom: 16px; }
        .noir-sectiontitle {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-inverse);
          margin-bottom: 8px; border-bottom: 1px solid var(--line); padding-bottom: 4px;
        }
        .noir-grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .noir-grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .noir-field { margin-bottom: 4px; }
        .noir-field label { display: block; font-size: 11px; color: var(--muted-inverse); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.03em; }
        .noir-field input[type=text], .noir-field input[type=date], .noir-field input[type=number], .noir-field input[type=email], .noir-field input[type=tel] {
          width: 100%; background: var(--surface); border: 1px solid var(--line); border-radius: 7px;
          padding: 7px 9px; color: var(--text); font-family: 'IBM Plex Sans', sans-serif; font-size: 13px;
        }
        .noir-field input:focus { outline: none; border-color: var(--accent); }
        .noir-checkrow { display: flex; align-items: center; gap: 6px; }
        .noir-checkrow label { font-size: 11.5px; color: var(--text-inverse); text-transform: none; margin: 0; }
        .noir-modalactions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 18px; position: sticky; bottom: 0; background: var(--panel); padding-top: 10px; }
        .noir-hint { font-size: 11px; color: var(--muted-inverse); margin-top: 6px; }
        .noir-ratesuggest { margin-top: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .noir-ratesuggest-label { font-size: 11px; color: var(--muted-inverse); }
        .noir-ratechip {
          background: transparent; border: 1px solid var(--line); color: var(--accent-inverse);
          border-radius: 14px; padding: 4px 10px; font-size: 11.5px; cursor: pointer;
          font-family: 'IBM Plex Mono', monospace;
        }
        .noir-ratechip:hover { border-color: var(--accent-inverse); }
      `}</style>

      <div className="noir-sidebar">
        <div className="noir-brand">NO<span>IR</span></div>
        <div className="noir-brandsub">Booking manifest</div>
        <div className="noir-triplist">
          {(trips || []).map((t) => (
            <div key={t.id}>
              <button
                className={"noir-tripbtn" + (t.id === activeTripId ? " active" : "")}
                onClick={() => { setActiveTripId(t.id); setActivePage("roster"); }}
              >
                <span className="tname">{t.name}</span>
                <span className="tdates">{t.dates}</span>
              </button>
              {t.id === activeTripId && (
                <div className="noir-subnav">
                  <button
                    className={"noir-subnavitem" + (activePage === "roster" ? " active" : "")}
                    onClick={() => setActivePage("roster")}
                  >
                    Roster
                  </button>
                  <button
                    className={"noir-subnavitem" + (activePage === "demographics" ? " active" : "")}
                    onClick={() => setActivePage("demographics")}
                  >
                    Demographics
                  </button>
                  <button
                    className={"noir-subnavitem" + (activePage === "inventory" ? " active" : "")}
                    onClick={() => setActivePage("inventory")}
                  >
                    Inventory
                  </button>
                  <button
                    className={"noir-subnavitem" + (activePage === "commission" ? " active" : "")}
                    onClick={() => setActivePage("commission")}
                  >
                    Commission
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="noir-addtrip" onClick={openAddTrip}>+ New trip</button>

      </div>

      <div className="noir-main" style={{ position: "relative" }}>
        {loading && <div className="noir-empty">Loading manifest…</div>}
        {!loading && error && <div className="noir-empty">{error}</div>}

        {!loading && activeTrip && (
          <>
            <div className="noir-header">
              <div>
                <div className="noir-tripname">{activeTrip.name}</div>
                <div className="noir-tripmeta">{activeTrip.resort} · {activeTrip.dates}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {saving && <span className="noir-savingtag">Saving…</span>}
                {activePage === "roster" && <button className="noir-btn" onClick={openAddGuest}>+ Add guest</button>}
              </div>
            </div>

        {activePage === "demographics" && stats && (
          <div className="noir-demopage">
            <div className="noir-donutrow">
              {[
                {
                  label: "Gender",
                  data: [
                    { name: "Men", value: stats.menCount, color: "#f1ead9" },
                    { name: "Women", value: stats.womenCount, color: "#8a8172" },
                  ],
                  emptyNote: "No genders set yet.",
                },
                {
                  label: "Travel status",
                  data: [
                    { name: "Couple", value: stats.travelStatusCounts.Couple, color: "#f1ead9" },
                    { name: "Single", value: stats.travelStatusCounts.Single, color: "#8a8172" },
                  ],
                  emptyNote: "No travel status set yet.",
                },
                {
                  label: "Age range",
                  data: [
                    { name: "18-29", value: stats.ageCounts["18-29"], color: "#f1ead9" },
                    { name: "30-49", value: stats.ageCounts["30-49"], color: "#c9a15a" },
                    { name: "50+", value: stats.ageCounts["50+"], color: "#5c5648" },
                  ],
                  emptyNote: "No ages set yet.",
                },
              ].map((donut) => {
                const total = donut.data.reduce((s, d) => s + d.value, 0);
                return (
                  <div className="noir-piecard" key={donut.label}>
                    <div className="noir-blocklabel">{donut.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ width: 130, height: 130, flexShrink: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={total > 0 ? donut.data : [{ name: "No data", value: 1 }]}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={38}
                              outerRadius={62}
                              paddingAngle={total > 0 ? 2 : 0}
                              stroke="none"
                            >
                              {total > 0 ? (
                                donut.data.map((d) => <Cell key={d.name} fill={d.color} />)
                              ) : (
                                <Cell fill="var(--line)" />
                              )}
                            </Pie>
                            {total > 0 && <Tooltip />}
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="noir-breakdownlegend" style={{ flexDirection: "column", gap: 6 }}>
                        {total > 0 ? (
                          donut.data.map((d) => (
                            <div className="noir-breakdownitem" key={d.name}>
                              <span className="noir-breakdowndot" style={{ background: d.color }}></span>
                              {d.name} <strong>{d.value}</strong>
                            </div>
                          ))
                        ) : (
                          <div className="noir-breakdownitem">{donut.emptyNote}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="noir-stats" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 16 }}>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "men" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "men" ? null : "men")}>
                <div className="noir-statlabel">Men</div>
                <div className="noir-statval">{stats.menCount}</div>
              </button>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "women" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "women" ? null : "women")}>
                <div className="noir-statlabel">Women</div>
                <div className="noir-statval">{stats.womenCount}</div>
              </button>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "couples" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "couples" ? null : "couples")}>
                <div className="noir-statlabel">Couples</div>
                <div className="noir-statval">{stats.couplesCount}</div>
              </button>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "singleMen" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "singleMen" ? null : "singleMen")}>
                <div className="noir-statlabel">Single men</div>
                <div className="noir-statval">{stats.singleMen}</div>
              </button>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "singleWomen" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "singleWomen" ? null : "singleWomen")}>
                <div className="noir-statlabel">Single women</div>
                <div className="noir-statval">{stats.singleWomen}</div>
              </button>
            </div>

            <div className="noir-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 16 }}>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "age-18-29" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "age-18-29" ? null : "age-18-29")}>
                <div className="noir-statlabel">Age 18-29</div>
                <div className="noir-statval">{stats.ageCounts["18-29"]}</div>
              </button>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "age-30-49" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "age-30-49" ? null : "age-30-49")}>
                <div className="noir-statlabel">Age 30-49</div>
                <div className="noir-statval">{stats.ageCounts["30-49"]}</div>
              </button>
              <button type="button" className={"noir-statcard noir-statcard-clickable" + (demoOpenKey === "age-50+" ? " active" : "")} onClick={() => setDemoOpenKey(demoOpenKey === "age-50+" ? null : "age-50+")}>
                <div className="noir-statlabel">Age 50+</div>
                <div className="noir-statval">{stats.ageCounts["50+"]}</div>
              </button>
            </div>

            {demoOpenKey && !demoOpenKey.startsWith("celeb:") && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">
                  {
                    {
                      men: "Men",
                      women: "Women",
                      couples: "Couples",
                      singleMen: "Single men",
                      singleWomen: "Single women",
                      "age-18-29": "Age 18-29",
                      "age-30-49": "Age 30-49",
                      "age-50+": "Age 50+",
                    }[demoOpenKey]
                  }
                </div>
                {(() => {
                  const list =
                    {
                      men: stats.menNames,
                      women: stats.womenNames,
                      couples: stats.couplesNames,
                      singleMen: stats.singleMenNames,
                      singleWomen: stats.singleWomenNames,
                      "age-18-29": stats.ageNames["18-29"],
                      "age-30-49": stats.ageNames["30-49"],
                      "age-50+": stats.ageNames["50+"],
                    }[demoOpenKey] || [];
                  return list.length === 0 ? (
                    <div className="noir-empty" style={{ padding: "10px 0" }}>No one here yet.</div>
                  ) : (
                    <div className="noir-referrerlist">
                      <div className="noir-referrerrow">
                        <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                          {list.map((name) => (
                            <div key={name} className="noir-referreditem">{name}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="noir-agentblock">
              <div className="noir-blocklabel">Celebrations · click a card to see who and when</div>
              {stats.celebrationMap.size === 0 ? (
                <div className="noir-empty" style={{ padding: "10px 0" }}>No celebrations logged yet.</div>
              ) : (
                <div className="noir-agentcards">
                  {Array.from(stats.celebrationMap.entries())
                    .sort((a, b) => b[1].length - a[1].length)
                    .map(([celeb, list]) => (
                      <button
                        type="button"
                        key={celeb}
                        className={"noir-agentcard" + (demoOpenKey === "celeb:" + celeb ? " active" : "")}
                        onClick={() => setDemoOpenKey(demoOpenKey === "celeb:" + celeb ? null : "celeb:" + celeb)}
                      >
                        <div className="noir-statlabel">{celeb}</div>
                        <div className="noir-statval">{list.length}</div>
                      </button>
                    ))}
                </div>
              )}
              {demoOpenKey && demoOpenKey.startsWith("celeb:") && (
                <div className="noir-referrerlist" style={{ marginTop: 10 }}>
                  <div className="noir-referrerrow">
                    <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                      {(stats.celebrationMap.get(demoOpenKey.slice(6)) || []).map((item) => (
                        <div key={item.name} className="noir-referreditem">
                          {item.name}{item.date ? " — " + fmtDate(item.date) : ""}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="noir-hint" style={{ marginBottom: 16 }}>
              Based on the Gender, Travel status, and Age range fields in each guest's profile — anyone left unset won't
              show up in these counts yet. Couples counts any 2-person room by default unless Travel status says
              otherwise, matching how your sheet's side panel tallied it.
            </div>

            <div className="noir-agentblock">
              <button
                type="button"
                className="noir-btn ghost"
                onClick={() => setShowSetDemographics((v) => !v)}
              >
                {showSetDemographics ? "Hide set demographics" : "Set demographics"}
              </button>
              {showSetDemographics && (
              <div className="noir-demotable" style={{ marginTop: 12 }}>
                <div className="noir-demotablehead">
                  <span>Guest</span>
                  <span>Gender</span>
                  <span>Travel status</span>
                  <span>Age</span>
                </div>
                <div className="noir-genderlist" style={{ borderRadius: "0 0 10px 10px", borderTop: "none" }}>
                  {roster
                    .filter((g) => !g.cancelled)
                    .map((g) => (
                      <div key={g.id} className="noir-demotablerow">
                        <span className="noir-demoname">{g.name}</span>
                        <div className="noir-gendertoggle">
                          <button
                            type="button"
                            className={g.gender === "M" ? "active" : ""}
                            onClick={() => saveRoster(roster.map((r) => (r.id === g.id ? { ...r, gender: "M" } : r)))}
                          >
                            Man
                          </button>
                          <button
                            type="button"
                            className={g.gender === "F" ? "active" : ""}
                            onClick={() => saveRoster(roster.map((r) => (r.id === g.id ? { ...r, gender: "F" } : r)))}
                          >
                            Woman
                          </button>
                        </div>
                        <div className="noir-gendertoggle">
                          <button
                            type="button"
                            className={g.travelStatus === "Couple" ? "active" : ""}
                            onClick={() => saveRoster(roster.map((r) => (r.id === g.id ? { ...r, travelStatus: "Couple" } : r)))}
                          >
                            Couple
                          </button>
                          <button
                            type="button"
                            className={g.travelStatus === "Single" ? "active" : ""}
                            onClick={() => saveRoster(roster.map((r) => (r.id === g.id ? { ...r, travelStatus: "Single" } : r)))}
                          >
                            Single
                          </button>
                        </div>
                        <div className="noir-gendertoggle">
                          {["18-29", "30-49", "50+"].map((age) => (
                            <button
                              key={age}
                              type="button"
                              className={g.ageRange === age ? "active" : ""}
                              onClick={() => saveRoster(roster.map((r) => (r.id === g.id ? { ...r, ageRange: age } : r)))}
                            >
                              {age}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              )}
            </div>
          </div>
        )}

        {activePage === "inventory" && stats && (
          <div className="noir-demopage">
            {(() => {
              const totalHolding = ROOM_TYPE_ORDER.reduce(
                (s, t) => s + (ROOM_INVENTORY_BASE[t] || 0) + (ROOM_INVENTORY_ON_REQUEST[t] || 0),
                0
              );
              return (
                <div className="noir-stats" style={{ gridTemplateColumns: "repeat(1, 1fr)", marginBottom: 20, maxWidth: 260 }}>
                  <div className="noir-statcard">
                    <div className="noir-statlabel">Total rooms holding</div>
                    <div className="noir-statval">{totalHolding}</div>
                  </div>
                </div>
              );
            })()}

            <div className="noir-blocklabel">Overall inventory · click a card to see who's booked</div>
            <div className="noir-agentcards" style={{ marginBottom: 20 }}>
              {ROOM_TYPE_ORDER.filter((t) => ROOM_INVENTORY_BASE[t]).map((roomType) => {
                const base = ROOM_INVENTORY_BASE[roomType] || 0;
                const onRequest = ROOM_INVENTORY_ON_REQUEST[roomType] || 0;
                const holding = base + onRequest;
                const booked = stats.roomTypeCounts[roomType] || 0;
                const available = holding - booked;
                return (
                  <button
                    type="button"
                    key={roomType}
                    className={"noir-agentcard" + (roomTypeFilter === roomType ? " active" : "")}
                    onClick={() => { setRoomTypeFilter(roomType); setAgentFilter("all"); setFilter("active"); setActivePage("roster"); }}
                  >
                    <div className="noir-statlabel">{roomType}</div>
                    <div className="noir-statval" style={{ color: available < 0 ? "var(--warn)" : "var(--text-inverse)" }}>
                      {available} left
                    </div>
                    <div className="noir-sub" style={{ marginTop: 4 }}>{booked} booked / {holding} held</div>
                  </button>
                );
              })}
            </div>
            <div className="noir-hint" style={{ marginTop: -12, marginBottom: 20 }}>
              Held = current inventory + on request.
            </div>

            <div className="noir-blocklabel">On request · click a card to see current bookings</div>
            <div className="noir-agentcards" style={{ marginBottom: 20 }}>
              {ROOM_TYPE_ORDER.filter((t) => ROOM_INVENTORY_ON_REQUEST[t]).map((roomType) => {
                const booked = stats.roomTypeCounts[roomType] || 0;
                return (
                  <button
                    type="button"
                    key={roomType}
                    className={"noir-agentcard" + (roomTypeFilter === roomType ? " active" : "")}
                    onClick={() => { setRoomTypeFilter(roomType); setAgentFilter("all"); setFilter("active"); setActivePage("roster"); }}
                  >
                    <div className="noir-statlabel">{roomType}</div>
                    <div className="noir-statval">+{ROOM_INVENTORY_ON_REQUEST[roomType]}</div>
                    <div className="noir-sub" style={{ marginTop: 4 }}>{booked} currently booked</div>
                  </button>
                );
              })}
            </div>

            <div className="noir-hint">
              Left = held minus booked — a negative number means more guests are booked into that room type than
              we're currently holding.
            </div>
          </div>
        )}

        {activePage === "commission" && stats && (
          <div className="noir-demopage">
            <div className="noir-stats" style={{ gridTemplateColumns: "repeat(3, 1fr)", marginBottom: 20, maxWidth: 620 }}>
              <div className="noir-statcard">
                <div className="noir-statlabel">Total commission earned</div>
                <div className="noir-statval">{money(stats.revenueBreakdown.totalCommission)}</div>
              </div>
              <div className="noir-statcard">
                <div className="noir-statlabel">TJKC commission</div>
                <div className="noir-statval">{money(stats.revenueBreakdown.tjkcTotal)}</div>
              </div>
              <div className="noir-statcard">
                <div className="noir-statlabel">Commission → markup pool</div>
                <div className="noir-statval">{money(stats.markupPoolFromFreeAgents)}</div>
              </div>
            </div>

            <div className="noir-blocklabel">Agent stake in the trip</div>
            <div className="noir-hint" style={{ marginBottom: 10 }}>
              Rooms booked by that agent, divided by all priced rooms in the trip — rooms with no per-person rate
              attached aren't counted on either side of that math.
            </div>
            <div className="noir-agentcards" style={{ marginBottom: 20 }}>
              {[...AGENTS, "Free Agent"].map((agent) => {
                const count = stats.agentPricedRoomCounts[agent] || 0;
                const pct = stats.totalPricedRooms > 0 ? Math.round((count / stats.totalPricedRooms) * 1000) / 10 : 0;
                return (
                  <div key={agent} className="noir-agentcard" style={{ cursor: "default" }}>
                    <div className="noir-statlabel">{agent}</div>
                    <div className="noir-statval">{pct}%</div>
                    <div className="noir-sub" style={{ marginTop: 4 }}>{count} of {stats.totalPricedRooms} priced rooms</div>
                  </div>
                );
              })}
            </div>

            <div className="noir-hint">
              For commission earned by a specific agent, click into that agent's card under "Rooms by agent" on the
              Roster tab.
            </div>
          </div>
        )}


        {activePage === "roster" && stats && (
              <>
                <div className="noir-stats noir-stats-primary">
                  <button
                    type="button"
                    className={"noir-statcard noir-statcard-clickable" + (agentFilter === "all" && roomTypeFilter === "all" ? " active" : "")}
                    onClick={() => { setAgentFilter("all"); setRoomTypeFilter("all"); setShowGuestsByAgent((v) => !v); }}
                  >
                    <div className="noir-statlabel">Total guests</div>
                    <div className="noir-statval">{stats.count}</div>
                  </button>
                  <div className="noir-statcard">
                    <div className="noir-statlabel">Total rooms</div>
                    <div className="noir-statval">{stats.rooms}</div>
                  </div>
                  <button
                    type="button"
                    className={"noir-statcard noir-statcard-clickable" + (showRevenueBreakdown ? " active" : "")}
                    onClick={() => setShowRevenueBreakdown((v) => !v)}
                  >
                    <div className="noir-statlabel">Total revenue</div>
                    <div className="noir-statval">{money(stats.revenue)}</div>
                  </button>
                  <button
                    type="button"
                    className="noir-btn ghost noir-morebtn"
                    onClick={() => {
                      setShowMoreStats((v) => {
                        const next = !v;
                        if (!next) {
                          setShowCancelledBreakdown(false);
                          setShowKingBreakdown(false);
                          setShowDoublesBreakdown(false);
                          setShowAutoPayBreakdown(false);
                          setShowReferralBreakdown(false);
                          setAddonOpenKey(null);
                        }
                        return next;
                      });
                    }}
                  >
                    {showMoreStats ? "Hide stats" : "View more stats"}
                  </button>
                </div>

                {showMoreStats && (
                  <div className="noir-stats noir-stats-secondary" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                    <button
                      type="button"
                      className={"noir-statcard noir-statcard-clickable" + (showCancelledBreakdown ? " active" : "")}
                      onClick={() => setShowCancelledBreakdown((v) => !v)}
                    >
                      <div className="noir-statlabel">Cancelled</div>
                      <div className="noir-statval">{stats.cancelledCount}</div>
                    </button>
                    <button
                      type="button"
                      className={"noir-statcard noir-statcard-clickable" + (showKingBreakdown ? " active" : "")}
                      onClick={() => setShowKingBreakdown((v) => !v)}
                    >
                      <div className="noir-statlabel">King beds (rooms)</div>
                      <div className="noir-statval">{stats.beddingCounts["1 King"]}</div>
                    </button>
                    <button
                      type="button"
                      className={"noir-statcard noir-statcard-clickable" + (showDoublesBreakdown ? " active" : "")}
                      onClick={() => setShowDoublesBreakdown((v) => !v)}
                    >
                      <div className="noir-statlabel">2 Doubles (rooms)</div>
                      <div className="noir-statval">{stats.beddingCounts["2 Doubles"]}</div>
                    </button>
                    <button
                      type="button"
                      className={"noir-statcard noir-statcard-clickable" + (showAutoPayBreakdown ? " active" : "")}
                      onClick={() => setShowAutoPayBreakdown((v) => !v)}
                    >
                      <div className="noir-statlabel">Auto pay</div>
                      <div className="noir-statval">{stats.autoPayCount}/{stats.count}</div>
                    </button>
                    <button
                      type="button"
                      className={"noir-statcard noir-statcard-clickable" + (showReferralBreakdown ? " active" : "")}
                      onClick={() => setShowReferralBreakdown((v) => !v)}
                    >
                      <div className="noir-statlabel">Referrals</div>
                      <div className="noir-statval">{stats.referralCount}</div>
                    </button>
                  </div>
                )}

                {showMoreStats && (
                  <div className="noir-agentblock">
                    <div className="noir-blocklabel">Add-ons · click a card to see who</div>
                    <div className="noir-agentcards">
                      {ADDONS.map((a) => (
                        <button
                          type="button"
                          key={a.key}
                          className={"noir-agentcard" + (addonOpenKey === a.key ? " active" : "")}
                          onClick={() => setAddonOpenKey(addonOpenKey === a.key ? null : a.key)}
                        >
                          <div className="noir-statlabel">{a.label}</div>
                          <div className="noir-statval">{stats.addonCounts[a.key]}</div>
                        </button>
                      ))}
                    </div>
                    {addonOpenKey && (
                      <div className="noir-referrerlist" style={{ marginTop: 10 }}>
                        <div className="noir-referrerrow">
                          <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                            {stats.addonNames[addonOpenKey].length === 0 ? (
                              <div className="noir-referreditem">No one booked yet.</div>
                            ) : (
                              stats.addonNames[addonOpenKey].map((name) => (
                                <div key={name} className="noir-referreditem">{name}</div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {stats && showMoreStats && showCancelledBreakdown && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Cancelled guests</div>
                {stats.cancelledNames.length === 0 ? (
                  <div className="noir-empty" style={{ padding: "10px 0" }}>No cancellations.</div>
                ) : (
                  <div className="noir-referrerlist">
                    <div className="noir-referrerrow">
                      <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                        {stats.cancelledNames.map((name) => (
                          <div key={name} className="noir-referreditem">{name}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stats && showMoreStats && showKingBreakdown && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Rooms with a king bed</div>
                {stats.beddingRoomNames["1 King"].length === 0 ? (
                  <div className="noir-empty" style={{ padding: "10px 0" }}>No king bed rooms yet.</div>
                ) : (
                  <div className="noir-referrerlist">
                    <div className="noir-referrerrow">
                      <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                        {stats.beddingRoomNames["1 King"].map((label) => (
                          <div key={label} className="noir-referreditem">{label}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stats && showMoreStats && showDoublesBreakdown && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Rooms with 2 doubles</div>
                {stats.beddingRoomNames["2 Doubles"].length === 0 ? (
                  <div className="noir-empty" style={{ padding: "10px 0" }}>No 2-doubles rooms yet.</div>
                ) : (
                  <div className="noir-referrerlist">
                    <div className="noir-referrerrow">
                      <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                        {stats.beddingRoomNames["2 Doubles"].map((label) => (
                          <div key={label} className="noir-referreditem">{label}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stats && showMoreStats && showAutoPayBreakdown && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Guests with Auto Pay on</div>
                {stats.autoPayNames.length === 0 ? (
                  <div className="noir-empty" style={{ padding: "10px 0" }}>No one has Auto Pay on yet.</div>
                ) : (
                  <div className="noir-referrerlist">
                    <div className="noir-referrerrow">
                      <div className="noir-referredlist" style={{ borderTop: "none", padding: "10px 14px" }}>
                        {stats.autoPayNames.map((name) => (
                          <div key={name} className="noir-referreditem">{name}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {stats && showMoreStats && showReferralBreakdown && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Referrals · click a name to see who they referred</div>
                {stats.referralMap.size === 0 ? (
                  <div className="noir-empty" style={{ padding: "10px 0" }}>No qualifying referrals yet.</div>
                ) : (
                  <div className="noir-referrerlist">
                    {Array.from(stats.referralMap.entries())
                      .sort((a, b) => b[1].length - a[1].length)
                      .map(([referrer, referred]) => (
                        <div key={referrer} className="noir-referrerrow">
                          <button
                            type="button"
                            className="noir-referrerbtn"
                            onClick={() => setExpandedReferrer(expandedReferrer === referrer ? null : referrer)}
                          >
                            <span>{referrer}</span>
                            <span className="noir-referrercount">{referred.length}</span>
                          </button>
                          {expandedReferrer === referrer && (
                            <div className="noir-referredlist">
                              {referred.map((name) => (
                                <div key={name} className="noir-referreditem">{name}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
                <div className="noir-hint">Carnisa, Ethan, Asia, LaQuanda, Dale, and RJ's referrals aren't counted here.</div>
              </div>
            )}

            {stats && showRevenueBreakdown && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Where the revenue goes</div>
                <div className="noir-breakdownbar">
                  {stats.revenue > 0 && (
                    <>
                      <div
                        className="noir-breakdownseg seg-vendor"
                        style={{ flexGrow: Math.max(stats.revenueBreakdown.funjetActualCost || stats.revenueBreakdown.vendorCost, 0) }}
                        title={"Funjet: " + money(stats.revenueBreakdown.funjetActualCost || stats.revenueBreakdown.vendorCost)}
                      ></div>
                      <div
                        className="noir-breakdownseg seg-agent"
                        style={{ flexGrow: Math.max(stats.revenueBreakdown.agentsKeepTotal, 0) }}
                        title={"Agent commission: " + money(stats.revenueBreakdown.agentsKeepTotal)}
                      ></div>
                      <div
                        className="noir-breakdownseg seg-tjkc"
                        style={{ flexGrow: Math.max(stats.revenueBreakdown.tjkcTotal, 0) }}
                        title={"TJKC split: " + money(stats.revenueBreakdown.tjkcTotal)}
                      ></div>
                      <div
                        className="noir-breakdownseg seg-markup"
                        style={{ flexGrow: Math.max(stats.revenueBreakdown.totalMarkupPool, 0) }}
                        title={"Markup pool: " + money(stats.revenueBreakdown.totalMarkupPool)}
                      ></div>
                      <div
                        className="noir-breakdownseg seg-unconfirmed"
                        style={{ flexGrow: Math.max(stats.revenueBreakdown.unconfirmedTotal, 0) }}
                        title={"Unconfirmed (Adrienne): " + money(stats.revenueBreakdown.unconfirmedTotal)}
                      ></div>
                      <div
                        className="noir-breakdownseg seg-insurance"
                        style={{ flexGrow: Math.max(stats.revenueBreakdown.insuranceRevenue, 0) }}
                        title={"Travel insurance: " + money(stats.revenueBreakdown.insuranceRevenue)}
                      ></div>
                    </>
                  )}
                </div>
                <div className="noir-breakdownlegend">
                  <div className="noir-breakdownitem">
                    <span className="noir-breakdowndot seg-vendor"></span>
                    Funjet <strong>{money(stats.revenueBreakdown.funjetActualCost || stats.revenueBreakdown.vendorCost)}</strong>
                  </div>
                  <div className="noir-breakdownitem">
                    <span className="noir-breakdowndot seg-agent"></span>
                    Agent commission <strong>{money(stats.revenueBreakdown.agentsKeepTotal)}</strong>
                  </div>
                  <div className="noir-breakdownitem">
                    <span className="noir-breakdowndot seg-tjkc"></span>
                    TJKC split <strong>{money(stats.revenueBreakdown.tjkcTotal)}</strong>
                  </div>
                  <div className="noir-breakdownitem">
                    <span className="noir-breakdowndot seg-markup"></span>
                    Markup pool <strong>{money(stats.revenueBreakdown.totalMarkupPool)}</strong>
                  </div>
                  <div className="noir-breakdownitem">
                    <span className="noir-breakdowndot seg-unconfirmed"></span>
                    Unconfirmed (Adrienne) <strong>{money(stats.revenueBreakdown.unconfirmedTotal)}</strong>
                  </div>
                  <div className="noir-breakdownitem">
                    <span className="noir-breakdowndot seg-insurance"></span>
                    Travel insurance <strong>{money(stats.revenueBreakdown.insuranceRevenue)}</strong>
                  </div>
                </div>
                <div className="noir-markupitems">
                  <div className="noir-blocklabel">Markup pool breakdown · {stats.guestsWithRate} of {stats.count} guests have a rate</div>
                  {MARKUP_LINE_ITEMS.map((item) => (
                    <div key={item.label} className="noir-markupitem">
                      <span>{item.label} (${item.amount}/person)</span>
                      <span className="noir-money">{money(item.amount * stats.guestsWithRate)}</span>
                    </div>
                  ))}
                  {stats.markupPoolFromFreeAgents > 0 && (
                    <div className="noir-markupitem">
                      <span>Free Agent commission windfall</span>
                      <span className="noir-money">{money(stats.markupPoolFromFreeAgents)}</span>
                    </div>
                  )}
                </div>
                <div className="noir-hint">
                  Funjet only counts rooms that have a Price entered — right now that's {stats.revenueBreakdown.funjetMatchedRooms + stats.revenueBreakdown.funjetUnmatchedRooms} of {stats.rooms} rooms.
                  Of those priced rooms, {stats.revenueBreakdown.funjetMatchedRooms} match your actual 5-night net rates by room type and occupancy.
                  {stats.revenueBreakdown.funjetUnmatchedRooms > 0 &&
                    ` The other ${stats.revenueBreakdown.funjetUnmatchedRooms} priced room(s) — PLAT 2BDRM, triples, or 4-night stays — aren't covered by that table yet, so they fall back to the revenue-minus-commission estimate.`}
                  {" "}The markup pool covers ${PER_PERSON_MARKUP} per person (itemized above), plus anything routed over
                  from Free Agent rooms.
                </div>
              </div>
            )}

            {stats && showGuestsByAgent && Object.keys(stats.agentGuestCounts).length > 0 && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Guests by agent · click a card to filter</div>
                <div className="noir-agentcards">
                  {Object.entries(stats.agentGuestCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([agent, count]) => (
                      <button
                        type="button"
                        key={agent}
                        className={"noir-agentcard" + (agentFilter === agent ? " active" : "")}
                        onClick={() => setAgentFilter(agentFilter === agent ? "all" : agent)}
                      >
                        <div className="noir-statlabel">{agent}</div>
                        <div className="noir-statval">{count}</div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {stats && Object.keys(stats.agentRoomCounts).length > 0 && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">Rooms by agent · click a card to filter</div>
                <div className="noir-agentcards">
                  {Object.entries(stats.agentRoomCounts)
                    .sort((a, b) => b[1] - a[1])
                    .map(([agent, count]) => (
                      <button
                        type="button"
                        key={agent}
                        className={"noir-agentcard" + (agentFilter === agent ? " active" : "")}
                        onClick={() => setAgentFilter(agentFilter === agent ? "all" : agent)}
                      >
                        <div className="noir-statlabel">{agent}</div>
                        <div className="noir-statval">{count}</div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {stats && agentFilter !== "all" && stats.agentCommissionTotals[agentFilter] && (
              <div className="noir-agentblock">
                <div className="noir-blocklabel">{agentFilter}'s commission</div>
                <div className="noir-stats noir-stats-secondary" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  <div className="noir-statcard">
                    <div className="noir-statlabel">Commission earned</div>
                    <div className="noir-statval">{money(stats.agentCommissionTotals[agentFilter].commission)}</div>
                  </div>
                  {agentFilter === "Free Agent" ? (
                    <div className="noir-statcard" style={{ gridColumn: "span 2" }}>
                      <div className="noir-statlabel">Transfers to markup pool</div>
                      <div className="noir-statval">{money(stats.markupPoolFromFreeAgents)}</div>
                    </div>
                  ) : agentFilter === "Adrienne" ? (
                    <>
                      <div className="noir-statcard">
                        <div className="noir-statlabel">TJKC split</div>
                        <div className="noir-statval" style={{ fontSize: 14 }}>Unconfirmed</div>
                      </div>
                      <div className="noir-statcard">
                        <div className="noir-statlabel">Net commission</div>
                        <div className="noir-statval" style={{ fontSize: 14 }}>TBD</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="noir-statcard">
                        <div className="noir-statlabel">TJKC split</div>
                        <div className="noir-statval">{money(stats.agentCommissionTotals[agentFilter].tjkcDeduction)}</div>
                      </div>
                      <div className="noir-statcard">
                        <div className="noir-statlabel">Net commission</div>
                        <div className="noir-statval">
                          {money(
                            stats.agentCommissionTotals[agentFilter].commission -
                              stats.agentCommissionTotals[agentFilter].tjkcDeduction
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="noir-toolbar">
              <div className="noir-filters">
                {["active", "cancelled", "all"].map((f) => (
                  <button
                    key={f}
                    className={"noir-filterbtn" + (filter === f ? " active" : "")}
                    onClick={() => setFilter(f)}
                  >
                    {f[0].toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <select className="noir-select" value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
                <option value="all">All agents</option>
                {agentsInRoster.map((a) => <option key={a} value={a}>{a}</option>)}
                {roster && roster.some((g) => !g.agent) && <option value="Free Agent">Free Agent</option>}
              </select>
            </div>

            {groupedRooms.length === 0 ? (
              <div className="noir-empty">No guests here yet. Add the first one to start the manifest.</div>
            ) : (
              <table className="noir-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Agent</th>
                    <th>Price</th>
                    {agentFilter !== "all" && <th>Commission</th>}
                  </tr>
                </thead>
                <tbody>
                  {groupedRooms.map(({ key, guests }) => {
                    const ordered = [...guests].sort((a, b) => (b.primaryTraveler ? 1 : 0) - (a.primaryTraveler ? 1 : 0));
                    const first = ordered[0];
                    const primary = ordered.find((g) => g.primaryTraveler && g.agent);
                    const agents = primary
                      ? [primary.agent]
                      : Array.from(new Set(ordered.map((g) => g.agent).filter(Boolean)));
                    const roomPrice = ordered.reduce(
                      (s, g) => s + (Number(g.price) || 0) + (g.insurance ? INSURANCE_COST : 0),
                      0
                    );
                    const roomCommission = Number(first.commission) || 0;
                    const roomTjkc = Number(first.tjkcDeduction) || 0;
                    return (
                      <tr key={key}>
                        <td>
                          {ordered.map((g) => (
                            <div key={g.id} className={"noir-roomguest" + (g.cancelled ? " is-cancelled" : "")}>
                              <span className="noir-dot" style={{ background: g.registered ? "var(--ok)" : "var(--line)" }}></span>
                              <button type="button" className="noir-guestlink" onClick={() => openEditGuest(g)}>{g.name}</button>
                              {g.celebration && <span className="noir-sub"> · {g.celebration}</span>}
                            </div>
                          ))}
                        </td>
                        <td>
                          {first.roomType || "—"}
                          {first.bedding && <div className="noir-sub">{first.bedding}</div>}
                        </td>
                        <td>{agents.length ? agents.join(" / ") : "—"}</td>
                        <td className="noir-money">{money(roomPrice)}</td>
                        {agentFilter !== "all" && (
                          <td className="noir-money">
                            {money(roomCommission)}
                            {roomTjkc > 0 && <div className="noir-sub">−{money(roomTjkc)} TJKC</div>}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}


        {showTripForm && (
          <div className="noir-overlay">
            <div className="noir-modal" style={{ width: 380 }}>
              <h3>New trip</h3>
              <form onSubmit={submitTrip}>
                {field("Trip name", tripDraft.name, (v) => setTripDraft({ ...tripDraft, name: v }))}
                {field("Resort", tripDraft.resort, (v) => setTripDraft({ ...tripDraft, resort: v }))}
                {field("Dates", tripDraft.dates, (v) => setTripDraft({ ...tripDraft, dates: v }))}
                <div className="noir-modalactions">
                  <button type="button" className="noir-btn ghost" onClick={() => setShowTripForm(false)}>Cancel</button>
                  <button type="submit" className="noir-btn">Create trip</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showGuestForm && (
          <div className="noir-overlay">
            <div className="noir-modal">
              <h3>{editingId ? "Edit guest" : "Add guest"}</h3>
              <form onSubmit={submitGuest}>
                <div className="noir-section">
                  <div className="noir-sectiontitle">Contact</div>
                  <div className="noir-grid3">
                    {field("Name", guestDraft.name, (v) => setGuestDraft({ ...guestDraft, name: v }))}
                    {field("Instagram", guestDraft.instagram, (v) => setGuestDraft({ ...guestDraft, instagram: v }))}
                    {field("Email", guestDraft.email, (v) => setGuestDraft({ ...guestDraft, email: v }), "email")}
                  </div>
                  <div className="noir-grid3">
                    {field("Phone", guestDraft.phone, (v) => setGuestDraft({ ...guestDraft, phone: v }), "tel")}
                    {field("Arrival date", guestDraft.arrivalDate, (v) => setGuestDraft({ ...guestDraft, arrivalDate: v }), "date")}
                    {field("Referred by", guestDraft.referredBy, (v) => setGuestDraft({ ...guestDraft, referredBy: v }))}
                  </div>
                  <div className="noir-grid3" style={{ marginTop: 10 }}>
                    <div className="noir-field">
                      <label>Gender</label>
                      <select
                        className="noir-select"
                        style={{ width: "100%", borderRadius: 7 }}
                        value={guestDraft.gender}
                        onChange={(e) => setGuestDraft({ ...guestDraft, gender: e.target.value })}
                      >
                        <option value="">—</option>
                        <option value="M">Man</option>
                        <option value="F">Woman</option>
                      </select>
                    </div>
                    <div className="noir-field">
                      <label>Travel status</label>
                      <select
                        className="noir-select"
                        style={{ width: "100%", borderRadius: 7 }}
                        value={guestDraft.travelStatus}
                        onChange={(e) => setGuestDraft({ ...guestDraft, travelStatus: e.target.value })}
                      >
                        <option value="">—</option>
                        <option value="Couple">Couple</option>
                        <option value="Single">Single</option>
                      </select>
                    </div>
                    <div className="noir-field">
                      <label>Age range</label>
                      <select
                        className="noir-select"
                        style={{ width: "100%", borderRadius: 7 }}
                        value={guestDraft.ageRange}
                        onChange={(e) => setGuestDraft({ ...guestDraft, ageRange: e.target.value })}
                      >
                        <option value="">—</option>
                        <option value="18-29">18-29</option>
                        <option value="30-49">30-49</option>
                        <option value="50+">50+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="noir-section">
                  <div className="noir-sectiontitle">Room</div>
                  <div className="noir-grid3">
                    {field("Room type", guestDraft.roomType, (v) => setGuestDraft({ ...guestDraft, roomType: v }))}
                    {field("Bedding", guestDraft.bedding, (v) => setGuestDraft({ ...guestDraft, bedding: v }))}
                    <div className="noir-field">
                      <label>Agent</label>
                      <select
                        className="noir-select"
                        style={{ width: "100%", borderRadius: 7 }}
                        value={guestDraft.agent}
                        onChange={(e) => setGuestDraft({ ...guestDraft, agent: e.target.value })}
                      >
                        <option value="">—</option>
                        {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="noir-grid3" style={{ marginTop: 10 }}>
                    {field("Room group", guestDraft.roomGroup, (v) => setGuestDraft({ ...guestDraft, roomGroup: v }))}
                    {field("Price per guest", guestDraft.price, (v) => setGuestDraft({ ...guestDraft, price: v }), "number")}
                    <div className="noir-checkrow" style={{ alignSelf: "center", marginTop: 18 }}>
                      <input type="checkbox" checked={!!guestDraft.primaryTraveler} onChange={(e) => setGuestDraft({ ...guestDraft, primaryTraveler: e.target.checked })} />
                      <label>Primary traveler for this room</label>
                    </div>
                  </div>
                  <div className="noir-grid3" style={{ marginTop: 10 }}>
                    <div className="noir-field">
                      <label>Nights</label>
                      <select
                        className="noir-select"
                        style={{ width: "100%", borderRadius: 7 }}
                        value={guestDraft.nights}
                        onChange={(e) => setGuestDraft({ ...guestDraft, nights: e.target.value })}
                      >
                        <option value="">—</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    </div>
                  </div>
                  <div className="noir-hint">Give guests sharing one room the same room group name (e.g. "Erik + Apryl") so they count as one room, not two. The primary traveler's agent is used for that room's agent attribution.</div>
                  {(() => {
                    const rateTable = ROOM_RATES[guestDraft.roomType];
                    if (!rateTable) return null;
                    const groupKey = (guestDraft.roomGroup || "").trim();
                    let occupancyCount = 1;
                    if (groupKey && roster) {
                      occupancyCount =
                        roster.filter(
                          (g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey
                        ).length + 1;
                    }
                    const occLabel = OCCUPANCY_LABELS[occupancyCount];
                    if (!occLabel) return null;
                    const chips = [4, 5]
                      .map((nights) => ({ nights, price: rateTable[nights]?.[occLabel] }))
                      .filter((c) => c.price != null);
                    if (!chips.length) return null;
                    return (
                      <div className="noir-ratesuggest">
                        <span className="noir-ratesuggest-label">Suggested rate ({occLabel} occupancy):</span>
                        {chips.map((c) => (
                          <button
                            type="button"
                            key={c.nights}
                            className="noir-ratechip"
                            onClick={() => setGuestDraft({ ...guestDraft, price: String(c.price), nights: String(c.nights) })}
                          >
                            {c.nights}n: {money(c.price)}
                          </button>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                <div className="noir-section">
                  <div className="noir-sectiontitle">Booking status</div>
                  <div className="noir-grid4">
                    <div className="noir-checkrow">
                      <input type="checkbox" checked={guestDraft.itinerarySent} onChange={(e) => setGuestDraft({ ...guestDraft, itinerarySent: e.target.checked })} />
                      <label>Itinerary sent</label>
                    </div>
                    <div className="noir-checkrow">
                      <input type="checkbox" checked={guestDraft.autoPay} onChange={(e) => setGuestDraft({ ...guestDraft, autoPay: e.target.checked })} />
                      <label>Auto pay</label>
                    </div>
                    <div className="noir-checkrow">
                      <input type="checkbox" checked={guestDraft.insurance} onChange={(e) => setGuestDraft({ ...guestDraft, insurance: e.target.checked })} />
                      <label>Insurance (${INSURANCE_COST})</label>
                    </div>
                    <div className="noir-checkrow">
                      <input type="checkbox" checked={guestDraft.registered} onChange={(e) => setGuestDraft({ ...guestDraft, registered: e.target.checked })} />
                      <label>Registered</label>
                    </div>
                  </div>
                  <div className="noir-grid3" style={{ marginTop: 10 }}>
                    {field("Date booked", guestDraft.dateBooked, (v) => setGuestDraft({ ...guestDraft, dateBooked: v }), "date")}
                    {field("Booking number", guestDraft.bookingNumber, (v) => setGuestDraft({ ...guestDraft, bookingNumber: v }))}
                  </div>
                </div>

                <div className="noir-section">
                  <div className="noir-sectiontitle">Celebration</div>
                  <div className="noir-grid3">
                    {field("Celebration", guestDraft.celebration, (v) => setGuestDraft({ ...guestDraft, celebration: v }))}
                    {field("Date of celebration", guestDraft.dateOfCeleb, (v) => setGuestDraft({ ...guestDraft, dateOfCeleb: v }), "date")}
                  </div>
                </div>

                <div className="noir-section">
                  <div className="noir-sectiontitle">Add-ons</div>
                  <div className="noir-grid4">
                    {ADDONS.map((a) => (
                      <div className="noir-checkrow" key={a.key}>
                        <input type="checkbox" checked={!!guestDraft[a.key]} onChange={(e) => setGuestDraft({ ...guestDraft, [a.key]: e.target.checked })} />
                        <label>{a.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="noir-section">
                  <div className="noir-sectiontitle">Commission</div>
                  <div className="noir-grid4">
                    <div className="noir-field">
                      <label>Net balance</label>
                      <input type="text" readOnly value={money((() => {
                        const groupKey = (guestDraft.roomGroup || "").trim();
                        let occupancyCount = 1;
                        let roommates = [];
                        if (groupKey && roster) {
                          roommates = roster.filter(
                            (g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey
                          );
                          occupancyCount = roommates.length + 1;
                        }
                        const occKey = occupancyCount === 1 ? "solo" : occupancyCount === 2 ? "double" : null;
                        const roomHasRate = (Number(guestDraft.price) > 0) || roommates.some((g) => Number(g.price) > 0);
                        const funjet = roomHasRate && guestDraft.nights ? getFunjetRate(guestDraft.nights, occKey, guestDraft.roomType) : null;
                        return funjet ? funjet.net : Number(guestDraft.netBalance) || 0;
                      })())} style={{ opacity: 0.8 }} />
                    </div>
                    <div className="noir-field">
                      <label>Commission</label>
                      <input type="text" readOnly value={money((() => {
                        const groupKey = (guestDraft.roomGroup || "").trim();
                        let occupancyCount = 1;
                        if (groupKey && roster) {
                          occupancyCount =
                            roster.filter(
                              (g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey
                            ).length + 1;
                        }
                        const occKey = occupancyCount === 1 ? "solo" : occupancyCount === 2 ? "double" : null;
                        const roommatesForRate = groupKey && roster
                          ? roster.filter((g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey)
                          : [];
                        const roomHasRate = (Number(guestDraft.price) > 0) || roommatesForRate.some((g) => Number(g.price) > 0);
                        const funjet = roomHasRate && guestDraft.nights ? getFunjetRate(guestDraft.nights, occKey, guestDraft.roomType) : null;
                        if (funjet) return funjet.commission;
                        if (!groupKey || !roster) return Number(guestDraft.commission) || 0;
                        const existing = roommatesForRate.find((g) => Number(g.commission) > 0);
                        return existing ? Number(existing.commission) : (Number(guestDraft.commission) || 0);
                      })())} style={{ opacity: 0.8 }} />
                    </div>
                    <div className="noir-field">
                      <label>VAX balance</label>
                      <input type="text" readOnly value={money((() => {
                        const groupKey = (guestDraft.roomGroup || "").trim();
                        let occupancyCount = 1;
                        let roommates = [];
                        if (groupKey && roster) {
                          roommates = roster.filter(
                            (g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey
                          );
                          occupancyCount = roommates.length + 1;
                        }
                        const occKey = occupancyCount === 1 ? "solo" : occupancyCount === 2 ? "double" : null;
                        const roomHasRateV = (Number(guestDraft.price) > 0) || roommates.some((g) => Number(g.price) > 0);
                        const funjet = roomHasRateV && guestDraft.nights ? getFunjetRate(guestDraft.nights, occKey, guestDraft.roomType) : null;
                        if (!funjet) return Number(guestDraft.vaxBalance) || 0;
                        const insuredCost =
                          (guestDraft.insurance ? INSURANCE_COST : 0) +
                          roommates.reduce((s, g) => s + (g.insurance ? INSURANCE_COST : 0), 0);
                        return funjet.net + insuredCost + funjet.commission;
                      })())} style={{ opacity: 0.8 }} />
                    </div>
                    <div className="noir-field">
                      <label>TJ balance</label>
                      <input type="text" readOnly value={money((() => {
                        const groupKey = (guestDraft.roomGroup || "").trim();
                        const selfAmount = (Number(guestDraft.price) || 0) + (guestDraft.insurance ? INSURANCE_COST : 0);
                        if (!groupKey || !roster) return selfAmount;
                        const others = roster
                          .filter((g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey)
                          .reduce((s, g) => s + (Number(g.price) || 0) + (g.insurance ? INSURANCE_COST : 0), 0);
                        return others + selfAmount;
                      })())} style={{ opacity: 0.8 }} />
                    </div>
                  </div>
                  <div className="noir-hint">
                    TJ balance updates automatically to match the room's total booking amount (sum of everyone's price
                    in that room). Commission auto-fills from the Funjet table once Nights, occupancy (room group), and
                    room type all match a known rate — otherwise it falls back to whatever's entered manually.
                  </div>
                  <div className="noir-grid3" style={{ marginTop: 10 }}>
                    <div className="noir-field">
                      <label>Difference (markup)</label>
                      <input type="text" readOnly value={money((() => {
                        const groupKey = (guestDraft.roomGroup || "").trim();
                        let roommates = [];
                        let occupancyCount = 1;
                        if (groupKey && roster) {
                          roommates = roster.filter(
                            (g) => !g.cancelled && g.id !== guestDraft.id && (g.roomGroup || "").trim() === groupKey
                          );
                          occupancyCount = roommates.length + 1;
                        }
                        const occKey = occupancyCount === 1 ? "solo" : occupancyCount === 2 ? "double" : null;
                        const roomHasRateD = (Number(guestDraft.price) > 0) || roommates.some((g) => Number(g.price) > 0);
                        const funjet = roomHasRateD && guestDraft.nights ? getFunjetRate(guestDraft.nights, occKey, guestDraft.roomType) : null;
                        if (!funjet) return Number(guestDraft.difference) || 0;
                        const tjBalance =
                          roommates.reduce((s, g) => s + (Number(g.price) || 0) + (g.insurance ? INSURANCE_COST : 0), 0) +
                          (Number(guestDraft.price) || 0) +
                          (guestDraft.insurance ? INSURANCE_COST : 0);
                        const insuredCost =
                          (guestDraft.insurance ? INSURANCE_COST : 0) +
                          roommates.reduce((s, g) => s + (g.insurance ? INSURANCE_COST : 0), 0);
                        const vaxBalance = funjet.net + insuredCost + funjet.commission;
                        return tjBalance - vaxBalance;
                      })())} style={{ opacity: 0.8 }} />
                    </div>
                    {(() => {
                      const roomCommission = Number(guestDraft.commission) || 0;
                      const agent = guestDraft.agent;
                      if (agent === "Adrienne") {
                        return (
                          <>
                            {field("TJKC deduction", guestDraft.tjkcDeduction, (v) => setGuestDraft({ ...guestDraft, tjkcDeduction: v }), "number")}
                            {field("Net commission", guestDraft.netCommission, (v) => setGuestDraft({ ...guestDraft, netCommission: v }), "number")}
                          </>
                        );
                      }
                      const rate = agent ? AGENT_SPLIT_RATES[agent] : undefined;
                      const hasRate = typeof rate === "number";
                      const tjkc = hasRate ? roomCommission * (1 - rate) : 0;
                      const net = hasRate ? roomCommission * rate : 0;
                      return (
                        <>
                          <div className="noir-field">
                            <label>TJKC deduction</label>
                            <input type="text" readOnly value={money(tjkc)} style={{ opacity: 0.8 }} />
                          </div>
                          <div className="noir-field">
                            <label>Net commission</label>
                            <input type="text" readOnly value={money(net)} style={{ opacity: 0.8 }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="noir-modalactions">
                  {editingId && (
                    <>
                      <button
                        type="button"
                        className="noir-btn ghost"
                        style={{ marginRight: "auto" }}
                        onClick={async () => { await deleteGuest(guestDraft); setShowGuestForm(false); }}
                      >
                        Delete guest
                      </button>
                      <button
                        type="button"
                        className="noir-btn ghost"
                        onClick={() => setGuestDraft({ ...guestDraft, cancelled: !guestDraft.cancelled })}
                      >
                        {guestDraft.cancelled ? "Restore guest" : "Mark cancelled"}
                      </button>
                    </>
                  )}
                  <button type="button" className="noir-btn ghost" onClick={() => setShowGuestForm(false)}>Close</button>
                  <button type="submit" className="noir-btn">{editingId ? "Save changes" : "Add guest"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
