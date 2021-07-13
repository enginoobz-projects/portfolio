import * as Selectors from './color-selectors.js'
import { Style } from './Style.js'
import { StyleRegistry } from './StyleRegistry.js';
import { Color, darkBaseValue, lightBaseValue } from './Color.js';
import { TinyColor } from './TinyColor.js';
import { StyleRuleStore } from './StyleRuleStore.js';


let $squareImg: JQuery<HTMLElement>;

let borderRadius: number = 15;

export let colorfull1: Color = new TinyColor("#00a584");
export let colorfull2: Color = new TinyColor("#ebbc00");
export let colorfull3: Color = new TinyColor("#e93666");

// export let schemeColor: Color = new TinyColor("#680317");
export let schemeColor: Color = new TinyColor("#D4D4D4");
export let highlightColor: Color = new TinyColor("#055CB3");
export let baseColor: string = darkBaseValue;
const lightMutedBaseColor: string = "#b2b2b2";
const darkMutedBaseColor: string = "#4D4D4D";
export let mutedBaseColor: string = darkMutedBaseColor;


export let currentStyle: Style;
let styleRegistry: StyleRegistry;

let hoverEventsAreSetup: boolean = false;
let clickEventsAreSetup: boolean = false;

export function changeStyle(htmlElement: HTMLElement | JQuery<HTMLElement>, newStyle: Style) {
        // currentStyle?.onDisable();
        currentStyle = newStyle;
        // update option buttons
        $('.theme-skin .button-border a').removeClass('active');
        $(htmlElement).children('.pill-button').addClass('active');
        $(".customizer").hide();
        $("body").removeClass();
        currentStyle.onEnable();
}

export function init() {
        styleRegistry = new StyleRegistry();
        $squareImg = $(".hero-image .square img");
        initSettingPanel();
        setupCustomizeEvents();
        // updateSchemeColor(schemeColor.hex);
        // updateHighlightColor(highlightColor.hex);
}

function initSettingPanel() {
        $("#scheme-color-picker").attr('value', schemeColor.hex);
        $("#highlight-color-picker").attr('value', highlightColor.hex);
        $('#border-radius').attr('value', borderRadius);
        $("#border-radius").next('.range-slider__value').html(borderRadius.toString());
}

function setupCustomizeEvents() {
        $("#color-switcher .pallet-button").on('click', function () {
                $("#color-switcher .color-pallet").toggleClass('show');
                $(this).toggleClass('active');
        });
        setupColorPickerEvents();
        setupRangeSliderEvents();
}

function setupColorPickerEvents() {
        $("#highlight-color-picker").on('input', function (event) {
                updateHighlightColor((event.target as any).value);
        });
        $("#scheme-color-picker").on('input', function (event) {
                updateSchemeColor((event.target as any).value);
        });
        $("#colorfull1-picker").on('input', function (event) {
                colorfull1.setHex((event.target as any).value);
                updateColorfull(1);
        });
        $("#colorfull2-picker").on('input', function (event) {
                colorfull2.setHex((event.target as any).value);
                updateColorfull(2);
        });
        $("#colorfull3-picker").on('input', function (event) {
                colorfull3.setHex((event.target as any).value);
                updateColorfull(3);
        });
}

function setupRangeSliderEvents() {
        $("#border-radius").on('input', (event) => {
                const newValue = (event.target as HTMLInputElement).value;
                $("#" + event.target.id).next('.range-slider__value').text(newValue);
                switch (event.target.id) {
                        case 'border-radius':
                                borderRadius = parseInt(newValue);
                                break;
                }
                updateBorder();
        });
}

function updateBorder() {
        $(Selectors.borderRadiusSelectors).css('border-radius', borderRadius);
        $('.background-item').css('border-radius', borderRadius * 6); // since its zoom is 1/6
        StyleRuleStore.Instance.getTrackScrollbarRule().style.setProperty('border-radius', `${borderRadius}px`, 'important');
        StyleRuleStore.Instance.getThumbScrollbarRule().style.setProperty('border-radius', `${borderRadius}px`, 'important');
}

function updateColorfull(colorfullNumber: number) {
        let colorfull: Color;
        let timelineSelector: string;
        if (colorfullNumber == 1) {
                colorfull = colorfull1;
                timelineSelector = '#education-timeline';
        }
        if (colorfullNumber == 2) {
                colorfull = colorfull2;
                timelineSelector = '#experience-timeline';
        }
        if (colorfullNumber == 3) {
                colorfull = colorfull3;
                timelineSelector = '#achievements-timeline';
        }

        $(`.colorfull${colorfullNumber}, .background-colorfull${colorfullNumber}>.badge`).css('color', colorfull!.hex);
        $(`.background-colorfull${colorfullNumber}`).css('background-color', colorfull!.hex);
        $(`.background-colorfull${colorfullNumber}`).css('color', colorfull!.getInvertBlackWhite());
        $(`${timelineSelector!} .timeline-item`).css('border-left-color', colorfull!.hex);
        $(`.badge-pill.background-colorfull${colorfullNumber} .badge`).css('background', colorfull!.getInvertBlackWhite());
};


function updateHighlightColor(hex: string) {
        highlightColor.setHex(hex);
        $(Selectors.colorHighlightColorSelectors).css("color", highlightColor.hex);
        $(Selectors.backgroundHighlightColorSelectors).css("background-color", highlightColor.hex);
        StyleRuleStore.Instance.getPagePillingSpanActiveRule().style.setProperty('background-color', highlightColor.hex, 'important');
        setupCommonHoverEvents();
        setupCommonClickEvents();
        currentStyle.onHighlightColorUpdated();
}

function updateSchemeColor(hex: string) {
        schemeColor.setHex(hex);
        updateBaseColor();
        updateCommonElements();
        updatePseudoElements();
        setupCommonHoverEvents();
        setupCommonClickEvents();
        currentStyle.onSchemeColorUpdated();
}


function setupCommonHoverEvents() {
        // lazily setup
        if (hoverEventsAreSetup) return;
        hoverEventsAreSetup = true;

        $(".portfolio .portfolio-icon a, .list-inline.socials li a i, #myMenu li a, .social a i,.overlay-menu-toggler").on('mouseenter', (event) => {
                $(event.currentTarget).css('color', highlightColor.hex);
        });

        $(".social a i,.overlay-menu-toggler, .portfolio .portfolio-icon a").on('mouseleave', function () {
                $(this).css('color', baseColor);
        });

        $(".list-inline.socials li a i, #myMenu li a").on('mouseleave', function () {
                $(this).css('color', 'white');
        });
}

function setupCommonClickEvents() {
        // lazily setup
        if (clickEventsAreSetup) return;
        clickEventsAreSetup = true;

        $('#portfolio .pill-button').on('click', function (this: HTMLElement) {
                // currentStyle.resetInactiveButtons(this);
        });
}

function updateCommonElements() {
        $(Selectors.backgroundSchemeColorSelectors).css("background-color", schemeColor.hex);
        $(Selectors.colorBaseColorSelectors).css("color", baseColor);
        $(Selectors.backgroundBaseColorSelectors).css("background-color", baseColor);
        $(Selectors.colorMutedBaseColorSelectors).css("color", mutedBaseColor);
}

function updatePseudoElements() {
        StyleRuleStore.Instance.getThumbScrollbarRule().style.background = schemeColor.hex;
        StyleRuleStore.Instance.getPlaceholderRule().style.color = mutedBaseColor;
        StyleRuleStore.Instance.getPagePillingSpanActiveRule().style.color = baseColor;
}

function updateBaseColor() {
        const lastBaseColor = baseColor;
        baseColor = schemeColor.getInvertBlackWhite();
        if (lastBaseColor != baseColor) onBaseColorChanged();
}

function onBaseColorChanged() {
        mutedBaseColor = (baseColor == lightBaseValue) ? lightMutedBaseColor : darkMutedBaseColor;
        const heroImg = (baseColor == lightBaseValue) ? "light-element_square" : "dark-element_square";
        $squareImg.attr('src', `assets/img/${heroImg}.png`);
        StyleRuleStore.Instance.getPagePillingSpanInactiveRule().style.setProperty('background-color', baseColor, 'important');
        StyleRuleStore.Instance.getPagePillingTooltipRule().style.color = baseColor;
        StyleRuleStore.Instance.getPlaceholderRule().style.color = mutedBaseColor;
        currentStyle.onBaseColorUpdated();
}

