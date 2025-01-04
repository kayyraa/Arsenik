import * as Rom from "./rom.js";
import * as Api from "./api.js";

Rom.Elements.sort((A, B) => A.Radius - B.Radius).forEach(Element => {
    const Option = document.createElement("option");
    Option.innerHTML = `${Element.Symbol} - ${Element.Name}`;
    Option.selected = Element.Symbol === "H" ? true : false;
    Option.value = Element.Symbol;
    Api.ElementSelectionInput.appendChild(Option);
});

const Option = document.createElement("option");
Option.innerHTML = "Custom";
Option.value = ".";
Api.ElementSelectionInput.appendChild(Option);

Api.DisplayConnectionLength.addEventListener("click", () => {
    window.LengthData = !window.LengthData;
});

Api.DisplayConnectionAtomCount.addEventListener("click", () => {
    window.AtomCountData = !window.AtomCountData;
});

document.querySelectorAll("button[color][value]").forEach(Button => {
    Button.addEventListener("click", () => {
        Button.setAttribute("value", Button.getAttribute("value") === "true" ? "false" : "true");
        Button.innerHTML = Button.getAttribute("value") === "false" ? Button.innerHTML.replace("On", "Off") : Button.innerHTML.replace("Off", "On");
    });
});

function Loop() {
    document.querySelectorAll("div.Line").forEach(Line => {
        const Length = parseFloat(Line.style.width);
        if (window.View.DisplayConnectionData.LengthData) Line.querySelectorAll("span")[0].innerHTML = Length.toFixed(1);
    });

    requestAnimationFrame(Loop);
}

Loop();