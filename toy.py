import os, json, google.generativeai as genai
genai.configure(api_key="AIzaSyAoPw1blUCe-nUSKWxQQx9-B4_RH4D2GBE")
m = genai.GenerativeModel("gemini-2.5-flash")
r = m.generate_content("Return ONLY JSON: {\"ok\": true}")
print("STATUS OK:", bool(r.text), "BODY:", r.text[:120])
