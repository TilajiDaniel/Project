import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_login_success():
    # 1. WebDriver indítása (Chrome)
    driver = webdriver.Chrome()
    driver.maximize_window()
    
    # Beállítunk egy 10 másodperces maximum várakozási időt
    wait = WebDriverWait(driver, 10)

    try:
        # --- 1. LÉPÉS: NAVIGÁLÁS ---
        print("1. Navigálás a bejelentkezési oldalra...")
        driver.get("http://localhost:5173/login") # Cseréld ki a portot, ha nem 3000-es!

        # --- 2. LÉPÉS: ELEMEK MEGKERESÉSE ÉS KITÖLTÉS ---
        print("2. Várakozás a beviteli mezőkre és adatok megadása...")
        
        # Megvárjuk, amíg a username mező megjelenik a DOM-ban
        username_input = wait.until(EC.presence_of_element_located((By.NAME, "username")))
        password_input = driver.find_element(By.NAME, "password")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        # Beírjuk a tesztadatokat (Olyan adatokat adj meg, amik érvényesek a backendden!)
        username_input.send_keys("Admin")
        password_input.send_keys("asd123")

        # --- 3. LÉPÉS: ŰRLAP ELKÜLDÉSE ---
        submit_button.click()
        print("3. Bejelentkezés gomb megnyomva.")

        # --- 4. LÉPÉS: SIKERESSÉG ELLENŐRZÉSE (ASSERTION) ---
        print("4. Várakozás az átirányításra a /MainPage oldalra...")
        
        # Ha a bejelentkezés sikeres, a React router átirányít a /MainPage-re.
        # A teszt addig vár (max 10 mp-ig), amíg az URL-ben meg nem jelenik ez az útvonal.
        wait.until(EC.url_contains("/MainPage"))
        
        print("✅ A teszt sikeres! Az átirányítás megtörtént a főoldalra.")

        height_input = wait.until(
            EC.presence_of_element_located((By.XPATH, "//label[text()='Magasság (cm)']/following-sibling::input"))
        )
        weight_input = driver.find_element(By.XPATH, "//label[text()='Jelenlegi súly (kg)']/following-sibling::input")
        target_weight_input = driver.find_element(By.XPATH, "//label[text()='Cél súly (kg)']/following-sibling::input")
        
        save_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Mentés és Kezdés')]")

        # Adatok beírása (cseréld, amire szeretnéd)
        height_input.send_keys("180")
        weight_input.send_keys("85.5")
        target_weight_input.send_keys("75")
        
        # Gombnyomás
        save_button.click()
        print("✅ Kezdeti adatok kitöltve és elküldve.")

        # --- 6. LÉPÉS: ALERT (FELUGRÓ ABLAK) KEZELÉSE ---
        print("6. Várakozás a sikerességet jelző felugró ablakra (alert)...")
        
        # Megvárjuk, amíg az alert megjelenik a böngészőben
        alert = wait.until(EC.alert_is_present())
        
        # Ellenőrizzük az alert szövegét
        alert_text = alert.text
        print(f"✅ Alert megjelent. Szövege: '{alert_text}'")
        
        # Leokézzuk az alertet (megnyomjuk az OK gombot)
        alert.accept()
        
        print("🎉 A teljes teszt (Login + Modális ablak) sikeresen befejeződött!")

    except Exception as e:
        print(f"❌ Hiba történt a teszt során: {e}")
        
    finally:
        # Várunk 3 másodpercet, hogy lásd a böngészőben az eredményt, majd bezárjuk
        time.sleep(3)
        driver.quit()

if __name__ == "__main__":
    test_login_success()