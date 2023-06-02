const UIReferences = {

    mainScreen: document.querySelector(".mainScreen"),

    welcomeScreen: document.querySelector(".welcomeScreen"),

    changelogScreen: document.querySelector(".changelogScreen"),
    changelogScreenVersion: document.querySelector(".changelogScreen .header .version"),
    changelogScreenChangesContainer: document.querySelector(".changelogScreen .changes"),

    addWebClipScreen: document.querySelector(".addWebClipScreen"),
    flyswatterScreen: document.querySelector(".flyswatterScreen"),
    settingsScreen: document.querySelector(".settingsScreen"),

    rulesetSelectionScreen: document.querySelector(".rulesetSelectionScreen"),
    rulesetSelectionScreenRulesetList: document.querySelector(".rulesetSelectionScreen .rulesetList"),
    
    rulesetConfigurationScreen: document.querySelector(".rulesetConfigurationScreen")

}

const UIManager = {

    hide: function (element, transitionTime) {
        if (transitionTime) {
            element.classList.add("hidden");
        } else if (transitionTime === null) {
            element.style.transition = "none";
            requestAnimationFrame(function () {
                element.classList.add("hidden");
                requestAnimationFrame(function () {
                    element.style.removeProperty("transition");
                });
            });
        } else {
            element.classList.add("hidden");
        }
    },
    show: function (element, transitionTime) {

        if (transitionTime) {
            //If the element was hidden before, we'll need to make sure that requireDisplayNone is removed in order to show the animation.
            element.classList.remove("hidden");
        } else if (transitionTime === null) {
            element.style.transition = "none";
            requestAnimationFrame(function () {
                element.classList.add("hidden");
                requestAnimationFrame(function () {
                    element.style.removeProperty("transition");
                });
            });
        } else {
            element.classList.remove("hidden");
        }
    },

    buttonHandlers: {

        hideWelcomeScreen: function () {
            //If the browser is running on iPhone or iPad and is not mobile Chrome, and if the page is not running as a Web Clip already, show the Web Clip prompt screen to encourage the user to add it to his home screen.
            if (
                (window.navigator.userAgent.match(/iP(ad|hone)/i)) && !(window.navigator.userAgent.match(/CriOS/i)) && !window.navigator.standalone
            ) {
                UIManager.show(UIReferences.addWebClipScreen, 200);
            } else {
                UIManager.show(UIReferences.rulesetSelectionScreen, 200);
            }
        },

        hideChangelogScreen: function () {
            UIManager.hide(UIReferences.changelogScreen, 200);
        },

        hideAddWebClipScreen: function () {
            UIManager.show(UIReferences.rulesetSelectionScreen, 200);
            UIManager.hide(UIReferences.addWebClipScreen, 200);
        },

        showFlyswatterScreen: function () {
            UIManager.flyswatterScreen.showFlyswatterScreen();
        },
        closeFlyswatterScreen: function () {
            UIManager.flyswatterScreen.closeFlyswatterScreen();
        },

        showSettingsScreen: function () {
            UIManager.settingsScreen.populateAndShowSettingsScreen();
        },
        closeSettingsScreen: function () {
            UIManager.settingsScreen.closeSettingsScreen();
        },

        closeRulesetSelectionScreen: function () {
            UIManager.rulesetSelectionScreen.close()
        },
        
        closeRulesetConfigurationScreen: function () {
            UIManager.rulesetConfigurationScreen.close()
        },

    },

    welcomeScreen: {

        easterEgg: function () {
            if (++easterEggClickCount === 10) {
                easterEggClickCount = 0;
                UIReferences.welcomeScreen.classList.add("showEasterEgg");
                setTimeout(function () {
                    UIReferences.welcomeScreen.classList.remove("showEasterEgg");
                }, 10000)
            }
        }

    },

    flyswatterScreen: {

        questionTree: {
            name: "What type of problem are you experiencing?",
            id: "flyswatter.scorekeeper",
            options: [
                {
                    name: "Unexpected Behavior",
                    id: "flyswatter.scorekeeper.unexpectedBehavior",
                    options: [
                        {
                            name: "UI",
                            id: "flyswatter.scorekeeper.unexpectedBehavior.ui",
                            options: [
                                {
                                    name: "Animation Problem",
                                    id: "flyswatter.scorekeeper.unexpectedBehavior.ui.animation",
                                    options: null
                                },
                                {
                                    name: "Unresponsive Component",
                                    id: "flyswatter.scorekeeper.unexpectedBehavior.ui.unresponsiveComponent",
                                    options: null
                                },
                                {
                                    name: "Misplaced Component",
                                    id: "flyswatter.scorekeeper.unexpectedBehavior.ui.misplacedComponent",
                                    options: null
                                }
                            ]
                        },
                        {
                            name: "Illogical App Behavior",
                            id: "illogical",
                            options: null
                        }
                    ]
                },
                {
                    name: "Feature Suggestion",
                    id: "flyswatter.scorekeeper.featureSuggestion",
                    options: null
                }
            ]
        },

        currentOption: undefined,

        showFlyswatterScreen: function () {

            UIManager.show(UIReferences.flyswatterScreen, 200);

        },

        closeFlyswatterScreen: function () {
            UIManager.hide(UIReferences.flyswatterScreen, 200);

            setTimeout(function () {
                UIManager.flyswatterScreen.currentOption = undefined;
                //Remove all optionsContainers except for the first one
                while (UIReferences.flyswatterScreen.children.length > 2) {
                    UIReferences.flyswatterScreen.removeChild(UIReferences.flyswatterScreen.children[2]);
                }
            }, 200);
        },

        selectedOption: function (optionID) {
            if (!this.currentOption) {
                this.currentOption = this.questionTree;
            }

            var optionsContainerElement = document.createElement("div");
            optionsContainerElement.classList.add("optionsContainer");
            optionsContainerElement.classList.add("hidden");

            var titleElement = document.createElement("h2");
            titleElement.textContent = this.currentOption.name;
            titleElement.classList.add("title");
            optionsContainerElement.appendChild(titleElement);

            //Find the selected option by matching its ID
            for (var i = 0; i < this.currentOption.options.length; i++) {
                var currentOption = this.currentOption.options[i];
                if (currentOption.id == optionID) {
                    //If the selected option has suboptions, show them. If not, send the bug report.
                    if (currentOption.options) {
                        this.currentOption = currentOption;
                        titleElement.textContent = currentOption.name;
                        for (var j = 0; j < currentOption.options.length; j++) {
                            var currentSuboption = currentOption.options[j];
                            var optionElement = document.createElement("div");
                            optionElement.textContent = currentSuboption.name;
                            optionElement.classList.add("option");
                            (function (optionID) {
                                optionElement.onclick = function () {
                                    UIManager.flyswatterScreen.selectedOption(optionID);
                                }
                            })(currentSuboption.id)
                            optionsContainerElement.appendChild(optionElement);
                        }
                    } else {
                        UIManager.flyswatterScreen.closeFlyswatterScreen();
                        flyswatter.sendBugReport(optionID);
                    }
                    break;
                }
            }

            UIReferences.flyswatterScreen.appendChild(optionsContainerElement);
            requestAnimationFrame(function () {
                optionsContainerElement.classList.remove("hidden");
            });
        }

    },

    settingsScreen: {

        populateAndShowSettingsScreen: function () {

            //Update all checkboxes
            var settingsScreenToggles = document.querySelectorAll(".settingsScreen .checkbox");
            for (var i = 0; i < settingsScreenToggles.length; i++) {

                var currentToggle = settingsScreenToggles[i];
                var currentToggleSettingName = currentToggle.dataset.settingName;

                if (storageManager.get(currentToggleSettingName)) {
                    currentToggle.classList.add("checked");
                } else {
                    currentToggle.classList.remove("checked");
                }

            }

            //Update all color pickers
            var settingsScreenColorPickers = document.querySelectorAll(".settingsScreen .colorSelector .picker");
            for (var i = 0; i < settingsScreenColorPickers.length; i++) {

                var currentColorPicker = settingsScreenColorPickers[i];
                var currentColorPickerSettingName = currentColorPicker.dataset.settingName;

                currentColorPicker.value = storageManager.get(currentColorPickerSettingName);

            }

            //Show the screen
            UIManager.show(UIReferences.settingsScreen, 200);

        },

        closeSettingsScreen: function () {

            //Update all settings values
            var settingsScreenToggles = document.querySelectorAll(".settingsScreen .checkbox");
            for (var i = 0; i < settingsScreenToggles.length; i++) {
                var currentToggle = settingsScreenToggles[i];
                var currentToggleSettingName = currentToggle.dataset.settingName;

                storageManager.set(currentToggleSettingName, currentToggle.classList.contains("checked"));
            }

            //Update all color picker values
            var settingsScreenColorPickers = document.querySelectorAll(".settingsScreen .colorSelector .picker");
            for (var i = 0; i < settingsScreenColorPickers.length; i++) {
                var currentColorPicker = settingsScreenColorPickers[i];
                var currentColorPickerSettingName = currentColorPicker.dataset.settingName;

                storageManager.set(currentColorPickerSettingName, currentColorPicker.value);
            }

            //Run all settings update handlers
            var settingsUpdateHandlersKeys = Object.keys(UIManager.settingsScreen.settingUpdateHandlers);
            for (var i = 0; i < settingsUpdateHandlersKeys.length; i++) {
                UIManager.settingsScreen.settingUpdateHandlers[settingsUpdateHandlersKeys[i]]()
            }

            //Hide the screen
            UIManager.hide(UIReferences.settingsScreen, 200);

        },

        settingUpdateHandlers: {

            updateAppAccentColor: function () {
                function getContrastingColor(hexColor) {
                    //If a leading # is provided, remove it
                    if (hexColor.slice(0, 1) === '#') {
                        hexColor = hexColor.slice(1);
                    }

                    //If a three-character hexcode is provided, make it six-character
                    if (hexColor.length === 3) {
                        hexColor = hexColor.split('').map(function (hex) {
                            return hex + hex;
                        }).join('');
                    }

                    var r = parseInt(hexColor.substr(0, 2), 16);
                    var g = parseInt(hexColor.substr(2, 2), 16);
                    var b = parseInt(hexColor.substr(4, 2), 16);
                    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                    return (yiq >= 130) ? '#000000' : '#ffffff';
                }

                document.documentElement.style.setProperty("--app-accent-color", storageManager.get("appAccentColor"));
                document.documentElement.style.setProperty("--app-accent-color-dark", storageManager.get("appAccentColorDark"));

                var lightModeTextColor = getContrastingColor(storageManager.get("appAccentColor"));
                var darkModeTextColor = getContrastingColor(storageManager.get("appAccentColorDark"));
                document.documentElement.style.setProperty("--accent-color-text-color", lightModeTextColor);
                document.documentElement.style.setProperty("--accent-color-text-color-dark", darkModeTextColor);

                document.documentElement.classList.remove("lightModeLightAccentColor");
                document.documentElement.classList.remove("lightModeDarkAccentColor");
                document.documentElement.classList.remove("darkModeLightAccentColor");
                document.documentElement.classList.remove("darkModeDarkAccentColor");
                document.documentElement.classList.add((lightModeTextColor === "#000000") ? "lightModeLightAccentColor" : "lightModeDarkAccentColor");
                document.documentElement.classList.add((darkModeTextColor === "#000000") ? "darkModeLightAccentColor" : "darkModeDarkAccentColor");
            }

        },

        resetButtonHandlers: {

            resetAppAccentColor: function () {
                var computedStyle = getComputedStyle(document.body);

                storageManager.set("appAccentColor", computedStyle.getPropertyValue("--purple-color").trim());
                storageManager.set("appAccentColorDark", computedStyle.getPropertyValue("--purple-color-dark").trim());

                UIManager.settingsScreen.settingUpdateHandlers.updateAppAccentColor();
                UIManager.settingsScreen.populateAndShowSettingsScreen();
            }

        }

    },

    bannerNotificationManager: {

        queue: [],
        isRendering: false,

        timer: function (ms) {
            return new Promise(res => setTimeout(res, ms));
        },

        notificationElement: document.querySelector(".bannerNotification"),
        titleElement: document.querySelector(".bannerNotification .title"),
        subtitleElement: document.querySelector(".bannerNotification .subtitle"),

        showMessage: function (title, subtitle, extended) {

            this.queue.push({
                title: title,
                subtitle: subtitle,
                extended: extended
            });
            if (!this.isRendering) {
                this.render();
            }

        },

        render: async function () {

            this.isRendering = true;

            while (this.queue[0]) {

                var currentItem = this.queue[0];

                this.titleElement.textContent = currentItem.title;
                this.subtitleElement.textContent = currentItem.subtitle;

                this.notificationElement.classList.remove("hidden");

                this.queue.shift();

                if (currentItem.extended) {

                    await this.timer(6000);

                } else {

                    await this.timer(2000);

                }

            }

            this.notificationElement.classList.add("hidden");
            this.isRendering = false;

        }

    },

}

var easterEggClickCount = 0;

//Set up events for all checkboxes
var checkboxes = document.querySelectorAll(".checkbox");
for (var i = 0; i < checkboxes.length; i++) {

    var currentCheckbox = checkboxes[i];

    (function (checkbox) {
        checkbox.addEventListener("click", function () {
            checkbox.classList.toggle("checked");
        });
    })(currentCheckbox)

}

//Update colors
UIManager.settingsScreen.settingUpdateHandlers.updateAppAccentColor();

// When the window is being resized, don't let elements transition.
var resizeTimer;
window.addEventListener("resize", () => {
    document.body.classList.add("no-transition");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        document.body.classList.remove("no-transition");
    }, 200);
});

//Listen for Option key updates
var optionKeyDown = false;

document.body.onkeydown = function(e) {
  if (e.which === 18) {
    optionKeyDown = true;
  }
};

document.body.onkeyup = function(e) {
  if (e.which === 18) {
    optionKeyDown = false;
  }
};

function checkOptionKey() {
  if (document.webkitHidden) return;
  window.addEventListener('mousemove', function onMove(e) {
    optionKeyDown = e.altKey;
    window.removeEventListener('mousemove', onMove, false);
  }, false);
}

document.addEventListener('webkitvisibilitychange', checkOptionKey, false);
window.addEventListener('load', checkOptionKey, false);

//Perform UI setup

document.querySelector(".settingsScreen .about .version").textContent = "Version " + SCOREKEEPER_VERSION;
document.querySelector(".settingsScreen .about .build").textContent = "Build " + SCOREKEEPER_BUILD;
