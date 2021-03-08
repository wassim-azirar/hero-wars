import csv
import os
import time

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.chrome.options import Options

chromeDrivePath = 'C:\\Users\\wassi\\Documents\\tools\\chromedriver.exe'
projectFolder = 'C:\\Users\\wassi\\Documents\\repos\\hero-wars\\scrapping\\'


# get hero property if exist in DOM, or string.empty if not found
def get_property(driver, property):
    try:
        element = driver.find_element_by_xpath(f'//div[@data-source="{property}"]')
        return element.text.replace(',', '')

    except NoSuchElementException:
        return ''


with open(f'{projectFolder}heros-input.csv', newline='') as inputFile:
    data = csv.reader(inputFile, delimiter=';')

    # ignore headers
    next(data, None)

    for row in data:
        items = row

        name = items[0]
        image = items[1]
        url = items[2]
        role = items[3]
        attackType = items[4]

        URL = f"https://hero-wars.fandom.com/wiki/Heroes/{name}"

        options = Options()
        options.add_argument('--headless')
        browser = webdriver.Chrome(chromeDrivePath, options=options)
        browser.get(URL)

        # close cookies banner
        time.sleep(1)
        cookies = browser.find_element_by_xpath('/html/body/div[5]/div/div/div[2]/div[2]')
        cookies.click()

        power = get_property(browser, 'power_total')
        intelligence = get_property(browser, 'intelligence')
        agility = get_property(browser, 'agility')
        health = get_property(browser, 'health')
        armor = get_property(browser, 'armor')
        strength = get_property(browser, 'strength')
        magic_attack = get_property(browser, 'magic_attack')
        physical_attack = get_property(browser, 'physical_attack')
        magic_defense = get_property(browser, 'magic_defense')
        armor_penetration = get_property(browser, 'armor_penetration')
        dodge = get_property(browser, 'dodge')
        critical_hit_chance = get_property(browser, 'crit_hit_chance')
        www = get_property(browser, '')

        with open(os.path.join(projectFolder, 'heros-output.csv'), 'a', newline='') as file:
            writer = csv.writer(file, delimiter=';')
            writer.writerow(
                [
                    name, image, role, attackType, power, intelligence, agility, health, armor, strength,
                    magic_attack, physical_attack, magic_defense, armor_penetration, dodge, critical_hit_chance
                ])

        print(name)
        browser.close()
