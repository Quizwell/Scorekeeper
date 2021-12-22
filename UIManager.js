const UIReferences = {

    mainScreen: document.querySelector(".mainScreen"),

    welcomeScreen: document.querySelector(".welcomeScreen"),
    welcomeScreenHeader: document.querySelector(".welcomeScreen .headerBlock"),

    addWebClipScreen: document.querySelector(".addWebClipScreen"),

    flyswatterScreen: document.querySelector(".flyswatterScreen"),

    settingsScreen: document.querySelector(".settingsScreen"),
    
    rulesetSelectionScreen: document.querySelector(".rulesetSelectionScreen"),
    rulesetSelectionScreenRulesetList: document.querySelector(".rulesetSelectionScreen .rulesetList"),
    
    rulesetConfigurationScreen: document.querySelector(".rulesetConfigurationScreen"),

}

const UIManager = {

    hide: function (element, transitionTime) {

        //If no transition time is provided, just add the hidden class
        if (transitionTime) {

            element.classList.add("hidden");

            //Wait for the transition to complete, then force the element to hide
            setTimeout(function () {
                element.classList.add("requireDisplayNone");
            }, transitionTime);

        } else if (transitionTime === null) {

            element.style.transition = "none";

            requestAnimationFrame(function () {

                element.classList.add("requireDisplayNone");
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

        //If no transition time is provided, just remove the hidden class
        if (transitionTime) {

            //If the element was hidden before, we'll need to make sure that requireDisplayNone is removed in order to show the animation.
            element.classList.remove("requireDisplayNone");

            requestAnimationFrame(function () {
                element.classList.remove("hidden");
            });

        } else if (transitionTime === null) {

            element.style.transition = "none";

            requestAnimationFrame(function () {

                element.classList.add("requireDisplayNone");
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
        hideAddWebClipScreen: function () {

            UIManager.rulesetSelectionScreen.open();
            
            //Hide the Web Clip screen so that the user doesn't have to see it again when going back from the ruleset selection screen
            setTimeout(function () {
                UIManager.hide(UIReferences.addWebClipScreen, 200);
            }, 200);
            
        },

        showFlyswatterScreen: function () {

            UIManager.flyswatterScreen.open();

        },
        closeFlyswatterScreen: function () {

            UIManager.flyswatterScreen.close();

        },

        showSettingsScreen: function () {

            UIManager.settingsScreen.open();

        },
        closeSettingsScreen: function () {

            UIManager.settingsScreen.close();

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

            easterEggClickCount++;

            if (easterEggClickCount === 10) {

                easterEggClickCount = 0;

                UIReferences.welcomeScreenHeader.classList.add("easterEgg");

                setTimeout(function () {
                    UIReferences.welcomeScreenHeader.classList.remove("easterEgg");
                }, 10000)

            }

        }

    },

    flyswatterScreen: {

        open: function () {

            UIManager.show(UIReferences.flyswatterScreen, 200);

        },

        close: function () {

            UIManager.hide(UIReferences.flyswatterScreen, 200);

        },

        selectedOption: function (option) {

            UIManager.flyswatterScreen.closeFlyswatterScreen();
            flyswatter.sendBugReport(option);

        }

    },

    settingsScreen: {

        open: function () {

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

        close: function () {

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
                UIManager.settingsScreen.settingUpdateHandlers[settingsUpdateHandlersKeys]()
            }

            //Hide the screen
            UIManager.hide(UIReferences.settingsScreen, 200);

        },

        settingUpdateHandlers: {

            

        },

        resetButtonHandlers: {

            

        }

    },
    
    rulesetSelectionScreen: {
        
        open: function () {
            
            UIManager.show(UIReferences.rulesetSelectionScreen, 200);
            
        },
        
        close: function () {
            
            UIManager.hide(UIReferences.rulesetSelectionScreen, 200);
            
        }
        
    },
    
    rulesetConfigurationScreen: {
        
        populateAndOpen: function (rulesetID) {
            
            

            UIManager.show(UIReferences.rulesetConfigurationScreen, 200);
            
        },
        
        close: function () {
            
            UIManager.hide(UIReferences.rulesetConfigurationScreen, 200);
            
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

// When the window is being resized, don't let elements transition.
var resizeTimer;
window.addEventListener("resize", () => {
    document.body.classList.add("no-transition");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        document.body.classList.remove("no-transition");
    }, 200);
});

//Perform UI setup

document.querySelector(".settingsScreen .about .version").textContent = "Version " + SCOREKEEPER_VERSION;
document.querySelector(".settingsScreen .about .build").textContent = "Build " + SCOREKEEPER_BUILD;
