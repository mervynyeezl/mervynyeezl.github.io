<!DOCTYPE html>
<html>

<head>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="lib/onsen/css/onsenui.css">
    <link rel="stylesheet" href="lib/onsen/css/onsen-css-components.min.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <script src="lib/onsen/js/onsenui.min.js"></script>
    <script src="logging.js"></script>
    <script src="scripts.js"></script>

</head>

<body>

<ons-navigator swipeable id="myNavigator">
    <ons-page id="catalogue-page">

        <ons-tabbar swipeable position="bottom">
            <ons-tab page="start_page.html" label="DASHBOARD" icon="fa-stopwatch" active>
            </ons-tab>
            <ons-tab label="CHALLENGES" icon="fa-flag" active-icon="md-face">
            </ons-tab>
            <ons-tab label="DIET JOURNAL" icon="fa-utensils" active-icon="md-face">
            </ons-tab>
            <ons-tab label="HISTORY" icon="fa-clipboard-list" active-icon="md-face">
            </ons-tab>
        </ons-tabbar>
    </ons-page>
</ons-navigator>

<template id="start_page.html">
    <ons-page id="STARTPAGE">
        <div class="start_title">Healthy365</div>
        <img src="images/beepline.png" />
        <div class="center objectives_text" style="background-color: rgba(255, 255, 255, 0.85); margin-top: 10%"></div>
        <div style="text-align: center; margin-top: 20%;">
            <h1 style="text-align: center;">
                Press Start to Begin Trial
            </h1>
            <p hidden>
                <ons-input id="workerid" modifier="underbar" placeholder="Enter WorkerID" float></ons-input>
            </p>
        </div>
        <p style="margin-top: 30px;">
            <ons-button modifier="large" onclick="startPressed()" style="margin-top: 20%; background-color: #00D8CF; border-radius: 20px;">Start</ons-button>
        </p>
    </ons-page>

</template>

<template id="rewards.html">
    <ons-page id="REWARDS">

        <ons-toolbar>
            <div class="left">
                <ons-back-button></ons-back-button>
            </div>
            <div class="center">REWARDS</div>
            <div class="right">
                <ons-toolbar-button>
                    <ons-icon icon="ion-ios-paperplane-outline"></ons-icon>
                </ons-toolbar-button>
            </div>
        </ons-toolbar>
        <div class="center objectives_text" style="background-color: #FFD8D8;"></div>

        <div id="categories"></div>
        <div id="rewards"></div>

    </ons-page>
</template>

<template id="redeem_voucher.html">
    <ons-page id="REDEEM_VOUCHER">

        <ons-toolbar>
            <div class="left">
                <ons-back-button></ons-back-button>
            </div>
            <div class="center">REDEEM VOUCHER</div>
            <div class="right">
                <ons-toolbar-button>
                    <ons-icon icon="ion-ios-paperplane-outline"></ons-icon>
                </ons-toolbar-button>
            </div>
        </ons-toolbar>



        <ons-card class="redeem">
            <div class="center objectives_text" style="background-color: #FFD8D8;"></div>
            <br />
            <div class="title" id="vouchertitle"></div>
            <br />
            <div class="content">
                <span id="denomination" style="display:none"></span>
                <div class="denomination_selector">Select voucher denomination:</div>
                <div class="denomination_selector" id="denominations"></div>
                <br />
                <ons-row>
                    <ons-col class="redeem_content">Quantity</ons-col>
                </ons-row>
                <br />
                <ons-row>
                    <ons-col class="redeem_content">
                        <ons-row>
                            <ons-col>
                                <ons-icon icon="ion-ios-remove-circle-outline" size="25px" id="remove_quantity" style="color: #00D8CF">
                                </ons-icon>
                            </ons-col>
                            <ons-col id="quantity"></ons-col>
                            <ons-col>
                                <ons-icon icon="ion-ios-add-circle-outline" size="25px" id="add_quantity" style="color: #00D8CF"></ons-icon>
                            </ons-col>
                        </ons-row>
                    </ons-col>
                </ons-row>
                <br />
                <ons-list>
                    <ons-list-header>Reward Information</ons-list-header>
                    <ons-list-item>This is sample text</ons-list-item>
                </ons-list>
                <br />
                <ons-button class="redeem_button" modifier="large" onclick="onRedeemPressed(true)"  style="background-color: #00D8CF; border-radius: 20px;">Redeem
                </ons-button>
            </div>
        </ons-card>

    </ons-page>
</template>

<template id="redeem_points.html">
    <ons-page id="REDEEM_POINTS">

        <ons-toolbar>
            <div class="left">
                <ons-back-button></ons-back-button>
            </div>
            <div class="center">REDEEM POINTS</div>
            <div class="right">
                <ons-toolbar-button>
                    <ons-icon icon="ion-ios-paperplane-outline"></ons-icon>
                </ons-toolbar-button>
            </div>
        </ons-toolbar>

        <ons-card class="redeem">
            <div class="center objectives_text" style="background-color: #FFD8D8;"></div>
            <br />
            <div class="title" id="vouchertitle"><span class="outlet"></span></div>
            <br />
            <div class="content">
                <p>
                    Slide to select no. of points to redeem:<br />
                    <span id="quantity" style="color: #0476FB; font-size: medium; font-weight: bold;"></span> <span class="outlet"></span> Point(s)<br />
                    <ons-range id="points_slider" style="width: 100%" min="0" max="50" step="1" value="0">
                    </ons-range>
                </p>
                <br />
                <ons-button class="redeem_button" modifier="large" onclick="onRedeemPressed(false)" style="background-color: #00D8CF; border-radius: 20px;">Redeem
                </ons-button>
            </div>
        </ons-card>

    </ons-page>
</template>

<template id="cart.html">
    <ons-page id="CART">
        <ons-toolbar>
            <div class="left">
                <ons-back-button id="cart_back_button"></ons-back-button>
            </div>
            <div class="center">YOUR CART</div>
            <div class="right">
                <ons-toolbar-button>
                    <ons-icon icon="ion-ios-paperplane-outline"></ons-icon>
                </ons-toolbar-button>
            </div>
        </ons-toolbar>

        <ons-list>
            <ons-list-header>Vouchers Selected</ons-list-header>
            <div id="cart_items">
            </div>
        </ons-list>

    </ons-page>

</template>

<template id="correct_end.html">
    <ons-page id="CORRECT_END">

        <div style="text-align: center; margin-top: 20%; margin-left: 8px; margin-right: 8px">
            <h2 style="text-align: center;">
                You've successfully completed the task, thank you!
                Enter this password in the survey:
            </h2>
            <h1 class="veri_code" id="verification_code">
                HY63F8
            </h1>
        </div>
        <p style="text-align: center; margin-top: 30px; margin-left: 8px; margin-right: 8px">
            Make sure you copy/remember the verification code and enter it in the survey!
        </p>
    </ons-page>

</template>

</body>

</html>
