const categoryGroup = new CategoryGroup();

const denominations = {5: 750, 10: 1500, 15: 2250};

var colors = ["#dd6218", "#00a899", "#e3aa05", "#94b052"];

var objectives = [];

var workerID;

var typeCategorisation, outletCategorisation; // categorisation flag: 0 - false, 1 - true

var ansNum = 0;
// type: 0 - Voucher, 1 - Points Redemption
var allAns = [
    [{ name: 'KOI', quantity: 1, value: 5 }], // ansNum = 0
    [{ name: 'Sportslink', quantity: 1, value: 10 }], // ansNum = 1
    [{ name: 'Asiamall', quantity: 1, value: 20 }], // ansNum = 2
    [{ name: 'LiHO', quantity: 1, value: 5 }, { name: 'Qi Ji', quantity: 2, value: 5 }], // ansNum = 3
    [{ name: 'Key Power Sports', quantity: 1, value: 10 }, { name: 'Hillion', quantity: 2, value: 10 }], // ansNum = 4
    [{ name: 'Mr Bean', quantity: 1, value: 5 }, { name: 'Actxa', quantity: 1, value: 10 }, { name: 'Hillion', quantity: 2, value: 10 }], // ansNum = 5
    [{ name: 'Transitlink', quantity: 5, value: 1 }], // ansNum = 6
    [{ name: 'TapForMore', quantity: 10, value: 1 }], // ansNum = 7
    [{ name: 'Transitlink', quantity: 20, value: 1 }], // ansNum = 8
    [{ name: 'Transitlink', quantity: 5, value: 1 }, { name: 'TapForMore', quantity: 5, value: 1 }], // ansNum = 9
    [{ name: 'Transitlink', quantity: 10, value: 1 }, { name: 'TapForMore', quantity: 20, value: 1 }], // ansNum = 10
    [{ name: 'Transitlink', quantity: 20, value: 1 }, { name: 'TapForMore', quantity: 1, value: 1 }] // ansNum = 11
]
var ansCode = [9864, 9720, 9432, 8462, 4658, 3564, 2156, 1486, 1210, 1189, 9654, 5432];

function CategoryGroup() {
    this.categories = {};

    this.getCategory = function (name) {
        if (!(name in this.categories)) {
            this.categories[name] = new Category();
        }
        return this.categories[name];
    };
    this.getNames = function () {
        return Object.keys(this.categories).sort();
    };
}

function Category() {
    this.rewards = [];

    this.addReward = function (reward) {
        this.rewards.push(reward);
    };
}

function Reward(name, description, type) {
    this.name = name;
    this.description = description;
    this.type = type; // "V" - voucher, "P" - points
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

    objectives = allAns[ansNum];
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
            if (outletCategorisation == 1 || type == "P") {
                addRewardToCategory(category, name, name, type);
            } else {
                for (denomination in denominations) {
                    addRewardToCategory(category, name, "$" + denomination + " " + name, type);
                }
            }
        }
    }
}

function addRewardToCategory(category, name, description, type) {
    if (type == "V") {
        description += " Voucher";
    } else {
        description += " Points";
    }
    category.addReward(new Reward(name, description, type));
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
    var toastText = "Objectives left:";

    if (ansNum <= 3) {
        var textToAdd = " ";

        for (i = 0; i < objectives.length; i++) {
            textToAdd += objectives[i].quantity;
            textToAdd += " x ";
            textToAdd += objectives[i].name;
            textToAdd += " $";
            textToAdd += objectives[i].value;
            textToAdd += " | ";
        }

        toastText += textToAdd;
    }
    else {
        var textToAdd = " ";

        for (i = 0; i < objectives.length; i++) {
            textToAdd += objectives[i].name;
            textToAdd += " ";
            textToAdd += objectives[i].quantity;
            textToAdd += " Points | ";
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

    if (page.id == 'REWARDS') {
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

function displayRedeemVouchers(page) {
    page.querySelector('.title').innerText = page.data.title;
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
    var ons = "<ons-segment id='segment' style='width: 100%' active-index='0'>";
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
        row += updateRow(index++, colors, rewards);
        row += updateRow(index++, colors, rewards);
        row += "</ons-row>";
        ons += row;
    }
    document.getElementById("rewards").innerHTML = ons;
}

function updateRow(index, colors, rewards) {
    var color = colors[index % colors.length];
    if (index >= rewards.length) {
        return "<ons-col><div class='voucher_thumbnail'></div></ons-col>";
    } else {
        var reward = rewards[index];
        var ons = "<ons-col><div class='voucher_thumbnail' style='background-color: " + color + "' onclick='myNavigator.pushPage(`redeem_";
        if (reward.type == "V") {
            ons += "voucher";
        } else {
            ons += "points";
        }
        ons += ".html`, {data: {title: `" + reward.name + "`, description: `" + reward.description + "`}})'>" + reward.description + "</div></ons-col>";
        return ons;
    }
}

function updateDenominationMultiple(denomination) {
    var multiple = denominations[denomination];
    var healthpoints = multiple;
    var quantity = 1;
    document.getElementById('denomination').innerText = "$" + denomination;
    document.getElementById('multiple').innerText = multiple;
    updateHealthpointsQuantity(healthpoints, quantity);
    document.getElementById('add_quantity').onclick = function () {
        healthpoints = healthpoints + multiple;
        quantity = quantity + 1;
        updateHealthpointsQuantity(healthpoints, quantity);
    };
    document.getElementById('remove_quantity').onclick = function () {
        healthpoints = Math.max(healthpoints - multiple, 0);
        quantity = Math.max(quantity - 1, 1)
        updateHealthpointsQuantity(healthpoints, quantity);
    };
}

function updateHealthpointsQuantity(healthpoints, quantity) {
    document.getElementById('healthpoints').innerText = healthpoints;
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

        loggingjs.logEvent(null, 'startpressed', {
            eventName: 'startIsPressed',
            info: { 'workerID': workerID }
        });
    }

}

// Check if the user pressed redeem on the correct voucher page
function onRedeemPressed() {

    var currentVoucherID = document.getElementById('vouchertitle').innerText;

    var currentDenomination = document.getElementById('denomination').innerText;
    console.log(currentDenomination);

    var currentQuantity = document.getElementById('quantity').innerText;

    var voucherFound = false;
    for (i = 0; i < objectives.length; i++) {
        if (objectives[i].name == currentVoucherID) {
            voucherFound = true;
            if (objectives[i].quantity == currentQuantity) {
                objectives.splice(i, 1);
                updateObjectives();
                if (objectives.length <= 0) {
                    sendTrailCompleteAction();
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
    }

    if (!voucherFound) {
        ons.notification.toast('Wrong Voucher!', { timeout: 1000, animation: 'fall' });
        sendUserErrorAction("Wrong voucher name redeemed");
    }
}

function goToVoucher(targetTitle) {
    myNavigator.popPage({ data: { title: targetTitle } });
}

function updateCart() {
    var ons = "";
    var index = 0;
    document.getElementById("cart_back_button").onClick = function (event) {
        // Reset the whole stack instead of popping 1 page
        document.querySelector('ons-navigator').resetToPage('rewards.html');
    };

    while (index < cartItems.length) {
        row = "<ons-list-item>";
        row += "X " + cartItems[index].quantity + " " + cartItems[index].id;
        row += "<ons-button padding: 8px modifier='quiet' ";
        row += "onclick=\"goToVoucher(" + "'" + cartItems[index++].id + "'" + ")\" >edit</ons-button>";
        row += "</ons-list-item>";
        ons += row;
    }
    document.getElementById("cart_items").innerHTML = ons;
}

// Util functions
function sendUserErrorAction(description) {
    loggingjs.logEvent(null, 'usererror', {
        eventName: 'userErrorAction',
        info: { 'description': description }
    });
}

function sendTrailCompleteAction() {
    loggingjs.logEvent(null, 'usercompelte', {
        eventName: 'userTrailSuccess',
        info: { 'description': 'User successfully completed trail', 'ansNum': ansNum, 'workerID': workerID}
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