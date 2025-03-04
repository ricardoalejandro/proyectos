from flask import Flask, render_template, jsonify
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from waitress import serve

app = Flask(__name__)

driver = None

def initialize_driver():
    global driver
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=chrome_options)
    driver.get("https://web.whatsapp.com")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get-qr')
def get_qr():
    global driver
    if not driver:
        initialize_driver()
    
    try:
        qr_element = WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "canvas[aria-label='Scan me!']"))
        )
        qr_data = qr_element.get_attribute("data-ref")
        return jsonify({"qr": qr_data, "status": "success"})
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"})

@app.route('/check-auth')
def check_auth():
    global driver
    try:
        # Check if WhatsApp Web is authenticated
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div[data-testid='chat-list']"))
        )
        return jsonify({"status": "authenticated"})
    except:
        return jsonify({"status": "not_authenticated"})

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000)