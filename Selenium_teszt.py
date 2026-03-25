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
        driver.get("http://localhost:5173/login")

        # --- 2. LÉPÉS: ELEMEK MEGKERESÉSE ÉS KITÖLTÉS ---
        print("2. Várakozás a beviteli mezőkre és adatok megadása...")

        # Megvárjuk, amíg a username mező megjelenik
        username_input = wait.until(
            EC.presence_of_element_located((By.NAME, "username"))
        )
        password_input = driver.find_element(By.NAME, "password")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        # Beíjuk a tesztadatokat
        username_input.clear()
        password_input.clear()

        username_input.send_keys("asd")          # jó felhasználónév
        password_input.send_keys("asdasd")       # jó jelszó

        # --- 3. LÉPÉS: ŰRLAP ELKÜLDÉSE ---
        print("3. Bejelentkezés gomb megnyomva.")
        submit_button.click()

        # --- 4. LÉPÉS: SIKERES ÁTIRÁNYÍTÁS A FŐOLDALRA ---
        print("4. Várakozás az átirányításra a /MainPage oldalra...")
        wait.until(EC.url_contains("/MainPage"))
        print("✅ A teszt sikeres! Az átirányítás megtörtént a főoldalra.")

        # --- 5. LÉPÉS: SETUP FOLYAMAT (Profil) ---
        print("5. Setup: profil beállítás megnyitása...")

        # A "Profil beállítás" gombot a kódból a .step-button.profile class alapján keresed
        # CSS selector: .step-button.profile (aminek text-je "Profil beállítás")
        profile_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".step-button profile"))
        )
        profile_button.click()

        print("6. Profil modal kitöltése...")

        # Várunk a modal megjelenésére (pl. .modal-overlay vagy .modal-content)
        modal = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".modal-content"))
        )

        # Mezők: magasság, jelenlegi súly, cél súly
        height_input = modal.find_element(By.XPATH, ".//label[text()='Magasság (cm)']/following-sibling::input")
        weight_input = modal.find_element(By.XPATH, ".//label[text()='Jelenlegi súly (kg)']/following-sibling::input")
        target_weight_input = modal.find_element(By.XPATH, ".//label[text()='Cél súly (kg)']/following-sibling::input")

        # Kitöltés
        height_input.clear()
        height_input.send_keys("175")

        weight_input.clear()
        weight_input.send_keys("70")

        target_weight_input.clear()
        target_weight_input.send_keys("65")

        # Mentés gomb (.step-button.calc, "Mentés")
        save_button = modal.find_element(By.XPATH, ".//button[@type='submit' and text()='Mentés']")
        save_button.click()

        # Várakozás, hogy a profil gomb már "Profil kész ✓" legyen
        wait.until(
            EC.text_to_be_present_in_element(
                (By.CSS_SELECTOR, ".step-button.profile"), "Profil kész ✓"
            )
        )
        print("✅ Profil beállítás sikeresen mentve.")

        # --- 6. LÉPÉS: KALÓRIA KALKULÁTOR GOMBRA KATTINTÁS ---
        print("6. Navigálás a kalóriakalkulátorra...")

        calc_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".step-button.calc"))
        )
        calc_button.click()

        # Várakozás az új oldalra (pl. /Kalorie-kalkulator)
        wait.until(EC.url_contains("/Kalorie-kalkulator"))
        print("✅ Sikeres navigálás a kalóriakalkulátorra.")

        # Ide jöhet a kalóriakalkulátor tesztelése, de ez extra rész lehet
        # driver.back() -> vissza a főoldalra, ha folytatod a setupot
        driver.back()
        wait.until(EC.url_contains("/MainPage"))

        # --- 7. LÉPÉS: BEFEJEZÉS GOMB ---
        print("7. Befejezés gomb megnyomása...")

        finalize_button = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".step-button.finalize"))
        )
        finalize_button.click()

        # Várakozás, hogy a finalize gomb szövege "Minden kész ✓" legyen
        wait.until(
            EC.text_to_be_present_in_element(
                (By.CSS_SELECTOR, ".step-button.finalize"), "Minden kész ✓"

            )
        )
        print("✅ Folyamat befejezve, minden kész.")

        # --- 8. LÉPÉS: SIKERÜZENET MEGJELENÉSE ---
        success_message = wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, ".success-message p"))
        )
        assert "Gratulálunk! A rendszer készen áll a használatra." in success_message.text
        print("✅ Success message megjelenik a DOM-ban.")

    except Exception as e:
        print(f"❌ Hiba történt a teszt során: {e}")
        raise  # ha szeretnéd, hogy a CI/runner is észrevegye a hibát

    finally:
        # Várunk 3 másodpercet, hogy lásd a böngészőben az eredményt, majd bezárjuk
        time.sleep(3)
        driver.quit()


if __name__ == "__main__":
    test_login_success()
