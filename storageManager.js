const SCOREKEEPER_VERSION = "0.0.1";
const SCOREKEEPER_BUILD = "S-A0001";
const SCOREKEEPER_CHANGELOG = [
    {
        title: "Alpha Version 1",
        items: [
            "Here we go again..."
        ]
    }
];

var storageManager = {
    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: function (key) {
        var storedValue = localStorage.getItem(key);
        if (storedValue === undefined || storedValue === "undefined") {
            return undefined;
        } else {
            return JSON.parse(localStorage.getItem(key));
        }
    },
    setDefault: function (key, value) {
        //This function will set a value only if that value hasn't been set before
        if (localStorage.getItem(key)) {
            return true;
        } else {
            storageManager.set(key, value);
        }
    }
}

//Set defaults for settings screen settings
var settingsScreenToggles = document.querySelectorAll(".settingsScreen .checkbox");
for (var i = 0; i < settingsScreenToggles.length; i++) {
    var currentToggle = settingsScreenToggles[i];
    var currentToggleSettingName = currentToggle.dataset.settingName;
    storageManager.setDefault(currentToggleSettingName, currentToggle.classList.contains("checked"));
}

var settingsScreenColorPickers = document.querySelectorAll(".settingsScreen .colorSelector .picker");
for (var i = 0; i < settingsScreenColorPickers.length; i++) {
    var currentColorPicker = settingsScreenColorPickers[i];
    var currentColorPickerSettingName = currentColorPicker.dataset.settingName;
    storageManager.setDefault(currentColorPickerSettingName, currentColorPicker.value);
}