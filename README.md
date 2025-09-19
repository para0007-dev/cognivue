# Cognivue - not the final name

A responsive website focused on the importance of Vitamin D for brain health, featuring sun exposure tracking, nutrition recommendations, and more.

## PLEASE READ THIS IF YOU WANNA LEARN TO RUN THIS FOR THE FIRST TIME
### Steps to run the build locally
- Clone the repo onto your local machine.
- Ensure you have the following prerequisites:
    - PostgreSQL PgAdmin or equivalent.
    - NodeJS and npm
    - Python 3.13 +
- If you have the above installed, navigate to `cognivue/backend/cognivue/cognivue/settings.py`(*Please be careful of the multiple cognivues*) and under the databases codeblock, populate your credentials (database name, postgres username, postgres password).
- in the root repo directory (`/cognivue/`) run `npm install`
- Create a python virtual environment with `python -m venv venv`.
- Switch to the virtual environment
    - Windows: `venv/Scripts/activate`
    - Mac/Linux `source venv/bin/activate`
- Navigate to `cognivue/backend/cognivue` and run `pip install -r requirements.txt` to install all python dependancies.

Okay, hopefully you have all python and node dependancies installed and running without any problems.

Now navigate to `cognivue/backend/cognivue/manage.py` and do the following:
- (Make sure you are in the virtual environment) `python manage.py makemigrations`
- `python manage.py migrate`
- `python manage.py loaddata mealplans.json foods.json nutritiontips.json`.
- If these datasets load successfully, your terminal should say something like "close to 700 items added from 3 fistures".
- `python manage.py load_insights_csv --factoids "cognivue\backend\cognivue\insights\data\factoids.csv" --cards "cognivue\backend\cognivue\insights\data\cards.csv"` This command may need you to play around with the paths of where cards.csv and factoids.csv is located. But once it runs, you should get some green text letting you know the data loaded successfully.

Now, all your setup is done and datasets loaded, you can finally proceed with trying to run the build locally.
- #### Backend - in a terminal:
    - in `cognivue\backend\cognivue` run `python manage.py runserver`
- #### Frontend - in a diferent terminal:
    - in the root folder `cognivue\` run `npm run dev`

Then open the link that pops up on the frontend terminal and the build should be working.


## Local Testing

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

## Mobile Testing

1. Ensure phone and computer are on the same WiFi network
2. Start development server: `npm run dev -- --host`
3. Access on mobile browser: `http://[Computer-IP]:5173`
4. Or use QR code tools to generate quick access links

## Tech Stack

- Vue 3 + Vite
- Responsive Design
- Component Architecture
