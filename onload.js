//REGULAR ONLOAD CODE

//Populate ruleset selection screen
for (var i = 0; i < scoringEngine.rulesets.length; i++) {
    var currentRuleset = scoringEngine.rulesets[i];
    
    var rulesetContainer = document.createElement("div");
    rulesetContainer.classList.add("ruleset");
    (function (id) {
        rulesetContainer.onclick = function () {
            UIManager.rulesetConfigurationScreen.popoulateAndOpen(id);
        }
    })(currentRuleset.id)

    var rulesetInfoContainer = document.createElement("div");
    rulesetInfoContainer.classList.add("info");
    
    var rulesetNameText = document.createElement("p");
    rulesetNameText.classList.add("name");
    rulesetNameText.textContent = currentRuleset.info.name;

    var rulesetDenominationText = document.createElement("p");
    rulesetDenominationText.classList.add("denomination");
    rulesetDenominationText.textContent = currentRuleset.info.denominationName;
    rulesetInfoContainer.appendChild(rulesetNameText);
    rulesetInfoContainer.appendChild(rulesetDenominationText);

    var pictureElement = document.createElement("picture");
    pictureElement.classList.add("arrow");
    pictureElement.classList.add("down");

    var sourceElement = document.createElement("source");
    sourceElement.setAttribute("srcset", "/images/icons/BackArrow-White.svg");
    sourceElement.setAttribute("media", "(prefers-color-scheme: dark)");

    var imgElement = document.createElement("img");
    imgElement.setAttribute("width", "25px");
    imgElement.setAttribute("height", "auto");
    imgElement.src = "/images/icons/BackArrow.svg";

    pictureElement.appendChild(sourceElement);
    pictureElement.appendChild(imgElement);

    rulesetContainer.appendChild(rulesetInfoContainer);
    rulesetContainer.appendChild(pictureElement);

    UIReferences.rulesetSelectionScreenRulesetList.appendChild(rulesetContainer);
}

//VERSION AND UPDATE HANDLING

if (
    storageManager.get("lastUsedVersion") &&
    (storageManager.get("lastUsedVersion") != SCOREKEEPER_VERSION)
) {
    //This code runs if the current version of Content Judge is newer than the last used version
    UIReferences.changelogScreenVersion.textContent = "Version " + SCOREKEEPER_VERSION;
    for (var i = 0; i < SCOREKEEPER_CHANGELOG.length; i++) {
        var currentSection = SCOREKEEPER_CHANGELOG[i];
        if (currentSection.items.length > 0) {
            var titleElement = document.createElement("h3");
            titleElement.textContent = currentSection.title;
            UIReferences.changelogScreenChangesContainer.appendChild(titleElement);

            for (var c = 0; c < currentSection.items.length; c++) {
                var changeElement = document.createElement("p");
                changeElement.textContent = currentSection.items[c];
                UIReferences.changelogScreenChangesContainer.appendChild(changeElement);
            }
        }
    }
    UIManager.show(UIReferences.changelogScreen, 200);
}

if (
    storageManager.get("lastUsedVersion") &&
    (storageManager.get("lastUsedBuild") != SCOREKEEPER_BUILD)
) {
    //This code runs if the current build of Content Judge is newer than the last used build
}

//Set the current Content Judge version and build
storageManager.set("lastUsedVersion", SCOREKEEPER_VERSION);
storageManager.set("lastUsedBuild", SCOREKEEPER_BUILD);