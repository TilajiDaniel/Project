import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options

def test_login_success():
    # **1. Chrome beállítások optimalizálva**
    options = Options()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-blink-features=AutomationControlled")
    driver = webdriver.Chrome(options=options)
    
    wait = WebDriverWait(driver, 10)
    
    try:
        print("1. Navigálás a bejelentkezési oldalra...")
        driver.get("http://localhost:5173/login")

        print("2. Login adatok megadása...")
        username_input = wait.until(EC.presence_of_element_located((By.NAME, "username")))
        password_input = driver.find_element(By.NAME, "password")
        submit_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

        username_input.clear()
        password_input.clear()
        username_input.send_keys("Ading")
        password_input.send_keys("Asdasd1")

        print("3. Bejelentkezés...")
        submit_button.click()

        print("4. Várakozás MainPage-re...")
        wait.until(EC.url_contains("/MainPage"))
        print("✅ Sikeres bejelentkezés!")
        
        driver.save_screenshot("login_success.png")

        print("5. Profil setup...")
        profile_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".step-button.profile")))
        profile_button.click()

        print("6. Profil modal kitöltése...")
        modal = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".modal-content")))
        
        height_input = modal.find_element(By.XPATH, ".//label[contains(text(),'Height')]/following-sibling::input")
        weight_input = modal.find_element(By.XPATH, ".//label[contains(text(),'Current')]/following-sibling::input")
        target_weight_input = modal.find_element(By.XPATH, ".//label[contains(text(),'Target')]/following-sibling::input")

        height_input.clear()
        height_input.send_keys("175")
        weight_input.clear()
        weight_input.send_keys("70")
        target_weight_input.clear()
        target_weight_input.send_keys("65")

        driver.save_screenshot("profile_complete.png")
        save_button = modal.find_element(By.XPATH, ".//button[@type='submit']")
        driver.execute_script("arguments[0].click();", save_button)  

        print("✅ TELJES TESZT SIKERES!")
        driver.save_screenshot("final_success.png")

    except Exception as e:
        print(f"❌ HIBA: {e}")
        print(f"URL: {driver.current_url}")
        print(f"Title: {driver.title}")
        driver.save_screenshot("error_screenshot.png")
        raise

    finally:
        time.sleep(3)
        driver.quit()

if __name__ == "__main__":
    test_login_success()
