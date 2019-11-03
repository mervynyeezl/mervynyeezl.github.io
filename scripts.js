const categoryGroup = new CategoryGroup();

var denominations = { 5: 750, 10: 1500, 15: 2250 };

var objectives = [];

var permutation = 0;
var permutationText = 'permutation';

var workerID;

var typeCategorisation, outletCategorisation; // categorisation flag: 0 - false, 1 - true
var techniqueText = 'technique';
var ansNum = 0;
// type: 0 - Voucher, 1 - Points Redemption
var allAns = [
    [{ name: 'Melts', quantity: 1, value: '$5', category: 'Food' }], // ansNum = 0
    [{ name: 'Faraway Travel', quantity: 1, value: '$10', category: 'Travel' }], // ansNum = 1
    [{ name: 'Asia Mart', quantity: 1, value: '$15', category: 'Retail' }], // ansNum = 2
    [{ name: 'Salad Bar', quantity: 1, value: '$5', category: 'Food' }, { name: 'Boba Kingdom', quantity: 2, value: '$5', category: 'Food' }], // ansNum = 3
    [{ name: 'Super Sports', quantity: 1, value: '$10', category: 'Retail' }, { name: 'Lionhill', quantity: 2, value: '$10', category: 'Retail' }], // ansNum = 4
    [{ name: 'Heart Cake', quantity: 1, value: '$5', category: 'Food' }, { name: 'Bolt', quantity: 1, value: '$10', category: 'Wellness' }, { name: 'Lionhill', quantity: 2, value: '$10', category: 'Retail' }], // ansNum = 5
    [{ name: 'Fast Train', quantity: 5, value: '$1', category: 'Others' }], // ansNum = 6
    [{ name: 'Tap For More', quantity: 20, value: '$1', category: 'Others' }], // ansNum = 7
    [{ name: 'Action', quantity: 40, value: '$1', category: 'Wellness' }], // ansNum = 8
    [{ name: 'Pizza Restaurant', quantity: 5, value: '$1', category: 'Food' }, { name: 'Tap For More', quantity: 10, value: '$1', category: 'Others' }], // ansNum = 9
    [{ name: 'Fast Train', quantity: 10, value: '$1', category: 'Others' }, { name: 'Zalada', quantity: 30, value: '$1', category: 'Retail' }], // ansNum = 10
    [{ name: 'Fast Train', quantity: 45, value: '$1', category: 'Others' }, { name: 'Tap For More', quantity: 1, value: '$1', category: 'Others' }], // ansNum = 11
    [{ name: 'Wave Mall', quantity: 1, value: '$5', category: 'Retail' }] // ansNum = 12 for test
]
var ansCode = [9864, 9720, 9432, 8462, 4658, 3564, 2156, 1486, 1210, 1189, 9654, 5432, 1234];

function CategoryGroup() {
    this.categories = {};

    this.getCategory = function (name) {
        if (!(name in this.categories)) {
            this.categories[name] = new Category();
        }
        return this.categories[name];
    };
    this.getNames = function () {
        return Object.keys(this.categories);
    };
    this.shuffleCategories = function () {
        for (name in this.categories) {
            this.categories[name].shuffleRewards();
        }
    }
}

function Category() {
    this.rewards = [];

    this.addReward = function (reward) {
        this.rewards.push(reward);
    };
    this.shuffleRewards = function () {
        var lo = 0;
        var hi = this.rewards.length - 1;
        while (lo < hi) {
            var temp = this.rewards[lo];
            this.rewards[lo] = this.rewards[hi];
            this.rewards[hi] = temp;
            lo += 2;
            hi -= 2;
        }
    }
}

function Reward(name, description, type, imageUrl) {
    this.name = name;
    this.description = description;
    this.type = type; // "V" - voucher, "P" - points
    this.imageUrl = imageUrl;
}

$(document).ready(function () {
    var technique = getUrlParam('technique', "00");
    typeCategorisation = parseInt(technique.charAt(0));
    outletCategorisation = parseInt(technique.charAt(1));

    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function (data) {
            processData(data, outletCategorisation);
        }
    });
    ansNum = getUrlParam('ansnum', 0);

    permutation = getUrlParam('perm', 0)
    // permutate perm 0: 0-6-7-11 | perm 1: 7-11-0-6
    if (permutation == 1) {
        var tempAns = allAns;

        for (i = 0; i < 6; i++) {
            tempAns[i] = tempAns[i + 6];
            tempAns[i + 6] = allAns[i];
        }

        allAns = tempAns;
    }

    objectives = allAns[ansNum];
    
    updateObjectives();
});

function processData(allText, outletCategorisation) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];
    for (var index = 1; index < allTextLines.length; index++) {
        var data = allTextLines[index].split(',');
        if (data.length == headers.length) {
            var name = data[0];
            var type = data[1];
            var category = categoryGroup.getCategory(data[2]);
            var imageUrl = data[3];
            if (outletCategorisation == 1 || type == "P") {
                addRewardToCategory(category, name, name, type, imageUrl);
            } else {
                for (denomination in denominations) {
                    addRewardToCategory(category, name, "$" + denomination + " " + name, type, imageUrl);
                }
            }
        }
    }
    categoryGroup.shuffleCategories();
}

function addRewardToCategory(category, name, description, type, imageUrl) {
    if (type == "V") {
        description += " Voucher";
    } else {
        description += " Points";
    }
    category.addReward(new Reward(name, description, type, imageUrl));
}

// e.g.
// Objectives left:
// 1 x Koi $5
// 2 x LiHo $5
// 3 x KLOOK $10
//
// e.g.
// Objectives left:
// TapForMore 5000 Points
// Transitlink 3000 Points
function updateObjectives() {
    var toastText = "<b>Objectives left:</b><br />";

    if ((ansNum < 6 && permutation == 0) || (ansNum >= 6 && permutation == 1) || (ansNum == 12)) {
        var textToAdd = " ";

        for (i = 0; i < objectives.length; i++) {
            textToAdd += "Claim <b>";
            textToAdd += objectives[i].quantity;
            textToAdd += " x ";
            textToAdd += objectives[i].value;
            textToAdd += " voucher(s)</b> under <b>";
            textToAdd += objectives[i].name;
            textToAdd += "</b>";
            if (typeCategorisation) {
                textToAdd += " in \'" + objectives[i].category + "\' ";
            }
            textToAdd += "<br />";
        }

        toastText += textToAdd;
    }
    else {
        var textToAdd = " ";

        for (i = 0; i < objectives.length; i++) {
            textToAdd += "Claim <b>";
            textToAdd += objectives[i].quantity;
            textToAdd += " points</b> under <b>";
            textToAdd += objectives[i].name;
            textToAdd += "</b>";
            if (typeCategorisation) {
                textToAdd += " in \'" + objectives[i].category + "\' ";
            }
            textToAdd += "<br />";
        }

        toastText += textToAdd;
    }

    toastText += "";
    var elementsToChange = document.getElementsByClassName("objectives_text");

    for (i = 0; i < elementsToChange.length; i++) {
        elementsToChange[i].innerHTML = toastText;
    }

}

document.addEventListener('prechange', function (event) {
    document.querySelector('ons-toolbar .center')
        .innerHTML = event.tabItem.getAttribute('label');
});

document.addEventListener('init', function (event) {
    var page = event.target;

    updateObjectives();

    if (page.id == 'STARTPAGE') {
        document.getElementById('workerid').value = getUrlParam('workerid', '');
    } else if (page.id == 'REWARDS') {
        displayRewards(page);

    } else if (page.id == 'REDEEM_VOUCHER') {
        displayRedeemVouchers(page);

    } else if (page.id == 'REDEEM_POINTS') {
        displayRedeemPoints(page);

    } else if (page.id == 'CORRECT_END') {
        document.getElementById("verification_code").innerText = ansCode[ansNum];
    }
});

document.addEventListener('postchange', function (event) {
    var page = event.target;
    var srcElement = event.srcElement;
    if (srcElement.id == 'segment') {
        var categoryNames = categoryGroup.getNames();
        var categoryIndex = document.getElementById('segment').getActiveButtonIndex();
        var rewards = getRewards([categoryNames[categoryIndex]]);
        updateRewards(rewards);

    } else if (srcElement.id == 'denomination_segment') {
        var denominationIndex = document.getElementById('denomination_segment').getActiveButtonIndex();
        var denomination = Object.keys(denominations)[denominationIndex];
        updateDenominationMultiple(denomination);
    }
});

/*
document.addEventListener('postpop', function (event) {
    var page = event.target.topPage;

    console.log(page.id);
    if (page.id === 'REDEEM_VOUCHER') {

        page.querySelector('.title').innerText = page.data.title;

        var multiple = 750;
        var healthpoints = 750;
        var quantity = 1;
        updateHealthpointsQuantity(healthpoints, quantity);
        page.querySelector('#add_quantity').onclick = function () {
            healthpoints = healthpoints + multiple;
            quantity = quantity + 1;
            updateHealthpointsQuantity(healthpoints, quantity);
        };
        page.querySelector('#remove_quantity').onclick = function () {
            healthpoints = Math.max(healthpoints - multiple, 750);
            quantity = Math.max(quantity - 1, 1)
            updateHealthpointsQuantity(healthpoints, quantity);
        };
    }
});
*/

function displayRewards(page) {
    var categoryNames = categoryGroup.getNames();
    var rewards;
    if (typeCategorisation == 0) {
        document.getElementById("categories").style.display = "none";
        rewards = getRewards(categoryNames);
    } else {
        updateCategorySegment(categoryNames);
        var categoryIndex = document.getElementById('segment').getActiveButtonIndex();
        var rewards = getRewards([categoryNames[categoryIndex]]);
    }
    updateRewards(rewards);
}

function checkIfTitleIsInObjectives(title) {
    var isTargetStillInObjectives = false;
    for (i = 0; i < objectives.length; i++) {
        if (objectives[i].name == title)
            isTargetStillInObjectives = true;
    }

    if (!isTargetStillInObjectives) {
        sendUserErrorAction("User went into voucher/point that is not in objectives");
    }
}

function displayRedeemVouchers(page) {
    var title = page.data.title;
    page.querySelector('.title').innerText = title;
    checkIfTitleIsInObjectives(title);


    var description = page.data.description.split(" ");
    var denomination = Object.keys(denominations)[0];
    if (outletCategorisation == 0) {
        var denominationSelectors = page.querySelectorAll('.denomination_selector');
        for (ds of denominationSelectors) {
            ds.style.display = "none";
        }
        denomination = parseInt(description[0].substring(1));
    } else {
        updateDenominationSegment();
    }
    updateDenominationMultiple(denomination);
}

function displayRedeemPoints(page) {
    var outletSpans = page.querySelectorAll('.outlet');
    for (outletSpan of outletSpans) {
        outletSpan.innerText = page.data.title;
    }
    
    checkIfTitleIsInObjectives(page.data.title);

    var multiple = 150;
    var healthpoints = 0;
    var quantity = 0;
    updateHealthpointsQuantity(healthpoints, quantity);
    page.querySelector('#points_slider').oninput = function () {
        quantity = document.getElementById('points_slider').value;
        healthpoints = quantity * multiple;
        updateHealthpointsQuantity(healthpoints, quantity);
    }
    $('#card_id').on('input', function () {
        var value = $('#card_id').val();
        var formattedValue = formatCardNumber(value);
        $('#card_id').val(formattedValue);
    });
}

function getRewards(categoryNames) {
    var rewards = [];
    for (name of categoryNames) {
        var category = categoryGroup.getCategory(name);
        rewards = rewards.concat(category.rewards);
    }
    return rewards;
}

function updateCategorySegment(categoryNames) {
    var ons = "<ons-segment id='segment' style='width: 100%; margin: 5px auto;' active-index='0'>";
    for (name of categoryNames) {
        ons += "<button>" + name + "</button>";
    }
    ons += "</ons-segment>";
    document.getElementById("categories").innerHTML = ons;
}

function updateDenominationSegment() {
    var ons = "<ons-segment id='denomination_segment' style='width: 100%' active-index='0'>";
    for (denomination in denominations) {
        ons += "<button>" + "$" + denomination + "</button>";
    }
    ons += "</ons-segment>";
    document.getElementById("denominations").innerHTML = ons;
}

function updateRewards(rewards) {
    var ons = "";
    var index = 0;
    while (index < rewards.length) {
        row = "<ons-row class='user_cover'>";
        row += updateRow(index++, rewards);
        row += updateRow(index++, rewards);
        row += "</ons-row>";
        ons += row;
    }
    document.getElementById("rewards").innerHTML = ons;
}

function updateRow(index, rewards) {
    if (index >= rewards.length) {
        return "<ons-col><div class='voucher_thumbnail'></div></ons-col>";
    } else {
        var reward = rewards[index];
        var ons = "<ons-col><div class='voucher_thumbnail' style='border-color: #e6e6e6; border-radius: 10px; border-style: solid;' onclick='myNavigator.pushPage(`redeem_";
        if (reward.type == "V") {
            ons += "voucher";
        } else {
            ons += "points";
        }
        ons += ".html`, {data: {title: `" + reward.name + "`, description: `" + reward.description + "`}})'>";
        ons += "<img src='images/" + reward.imageUrl + "' class='image' />";
        ons += "<div class='description'>" + reward.description + "</div></div></ons-col>";
        return ons;
    }
}

function updateDenominationMultiple(denomination) {
    var multiple = denominations[denomination];
    var healthpoints = multiple;
    var quantity = 1;
    document.getElementById('denomination').innerText = "$" + denomination;
    updateHealthpointsQuantity(healthpoints, quantity);
    document.getElementById('add_quantity').onclick = function () {
        healthpoints = healthpoints + multiple;
        quantity = quantity + 1;
        updateHealthpointsQuantity(healthpoints, quantity);
    };
    document.getElementById('remove_quantity').onclick = function () {
        healthpoints = Math.max(healthpoints - multiple, multiple);
        quantity = Math.max(quantity - 1, 1)
        updateHealthpointsQuantity(healthpoints, quantity);
    };
}

function updateHealthpointsQuantity(healthpoints, quantity) {
    document.getElementById('quantity').innerText = quantity;
}

function formatCardNumber(value) {
    // remove all non digit characters
    var value = value.replace(/\D/g, '');
    var formattedValue;
    var maxLength;
    formattedValue = value.replace(/(\d{4})/, '$1 ').replace(/(\d{4}) (\d{4})/, '$1 $2 ').replace(/(\d{4}) (\d{4}) (\d{4})/, '$1 $2 $3 ');
    maxLength = 19;

    $('#card_id').attr('maxlength', maxLength);
    return formattedValue;
}

document.addEventListener('myevent', loggingjs.logEvent, true);

/*function sendCustomEvent() {
    console.log('sendCustomEvent');
    document.dispatchEvent(new CustomEvent('myevent', {
        detail: {
            eventName: 'myeventName',
            info: { 'key1': 'val1', 'key2': 'val2' }
        }
    }));
}


function sendCustomEvent2() {
    console.log('sendCustomEvent2');
    loggingjs.logEvent(null, 'myevent2', {
        eventName: 'myeventName',
        info: { 'key1': 'val1', 'key2': 'val2' }
    });
}*/

// When start is pressed, check if worker ID has been entered, if not, prompt
// If entered, bring user to voucher catalogue page
function startPressed() {
    workerID = document.getElementById('workerid').value;

    if (workerID.length <= 0) {
        ons.notification.toast('WorkerID Required', { timeout: 1000, animation: 'fall' });
        sendUserErrorAction("User did not enter Worker ID");
    }
    else {
        myNavigator.pushPage(`rewards.html`);

        sendUserStartPressed();
    }

}

// Check if the user pressed redeem on the correct voucher page
function onRedeemPressed(isVoucher) {

    var currentDenomination = '$1';

    var currentVoucherID = document.getElementById('vouchertitle').innerText;

    if (isVoucher) {
        currentDenomination = document.getElementById('denomination').innerText;
    }

    var currentQuantity = document.getElementById('quantity').innerText;

    var voucherFound = false;

    for (i = 0; i < objectives.length; i++) {
        if (objectives[i].name == currentVoucherID) {
            voucherFound = true;
            if (objectives[i].value == currentDenomination) {

                if (objectives[i].quantity == currentQuantity) {
                    objectives.splice(i, 1);
                    updateObjectives();
                    if (objectives.length <= 0) {
                        sendTrialCompleteAction();
                        myNavigator.pushPage('correct_end.html');
                    }
                    else {
                        myNavigator.resetToPage('rewards.html');
                    }

                } else {
                    ons.notification.toast('Right Voucher but wrong Quantity!', { timeout: 1000, animation: 'fall' });
                    sendUserErrorAction("Wrong voucher quantity redeemed");
                }

            }
            else {
                ons.notification.toast('Right Voucher but wrong Denomination', { timeout: 1000, animation: 'fall' });
                sendUserErrorAction("Wrong voucher denomination redeemed");
            }

        }
    }

    if (!voucherFound) {
        ons.notification.toast('Wrong Voucher!', { timeout: 1000, animation: 'fall' });
        sendUserErrorAction("Wrong voucher name redeemed");
    }
}

function updateLoggingTexts() {
    switch (permutation) {
        case '0':
            permutationText = 'Voucher First';
            break;
        case '1':
            permutationText = 'Points First';
            break;
        default:
    }

    console.log('typeCat: %d | outletCat: %d', typeCategorisation, outletCategorisation);


    if (typeCategorisation && outletCategorisation) {
        techniqueText = 'Type and Outlet';
    } else if (typeCategorisation && !outletCategorisation) {
        techniqueText = 'Type Only';
    } else if (!typeCategorisation && outletCategorisation) {
        techniqueText = 'Outlet Only';
    } else if (!typeCategorisation && !outletCategorisation) {
        techniqueText = 'No Categorisation';
    }
}

function sendUserStartPressed() {
    updateLoggingTexts();


    loggingjs.logEvent(null, 'startpressed', {
        eventName: 'startIsPressed',
        info: { 'workerID': workerID, 'trial': ansNum, 'permutation': permutationText, 'technique': techniqueText }
    });
}

// Util functions
function sendUserErrorAction(description) {
    updateLoggingTexts();

    loggingjs.logEvent(null, 'usererror', {
        eventName: 'userErrorAction',
        info: { 'description': description, 'workerID': workerID, 'trial': ansNum, 'permutation': permutationText, 'technique': techniqueText }
    });
}

function sendTrialCompleteAction() {
    updateLoggingTexts();

    loggingjs.logEvent(null, 'usercomplete', {
        eventName: 'userTrialSuccess',
        info: { 'description': 'User successfully completed trial', 'workerID': workerID, 'trial': ansNum, 'permutation': permutationText, 'technique': techniqueText }
    });
}

function getUrlParam(parameter, defaultvalue) {
    var urlparameter = defaultvalue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
