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
    window.View.DisplayConnectionData.LengthData = !window.View.DisplayConnectionData.LengthData;
});

document.querySelectorAll("button[color][value]").forEach(Button => {
    Button.addEventListener("click", () => {
        Button.setAttribute("value", Button.getAttribute("value") === "true" ? "false" : "true");
        Button.innerHTML = Button.getAttribute("value") === "false" ? Button.innerHTML.replace("On", "Off") : Button.innerHTML.replace("Off", "On");
    });
});

document.addEventListener("contextmenu", (Event) => {
    Event.preventDefault();
}, { passive: false });

function Loop() {
    document.querySelectorAll("div.Line").forEach(Line => {
        const Connection = JSON.parse(Line.getAttribute("Connection"));

        if (window.View.DisplayConnectionData.LengthData) Line.querySelectorAll("span")[0] ? Line.querySelectorAll("span")[0].innerHTML = parseFloat(Line.style.width).toFixed(1) : "";
        else Line.querySelectorAll("span")[0] ? Line.querySelectorAll("span")[0].innerHTML = "" : "";

        if (window.Simulation.Playing) {
            const NewLine = new Api.Line(undefined, [
                Api.Playground.querySelectorAll(`div:not(.Line)[uid="${Connection[0]}"]`)[0],
                Api.Playground.querySelectorAll(`div:not(.Line)[uid="${Connection[1]}"]`)[0]
            ]).Connect(Api.Playground, {
                Gradient: window.View.ConnectionStyle.Gradient ? new Api.Gradient(
                    new Api.Matrix([
                        Api.Playground.querySelectorAll(`div:not(.Line)[uid="${Connection[0]}"]`)[0].style.backgroundColor,
                        Api.Playground.querySelectorAll(`div:not(.Line)[uid="${Connection[1]}"]`)[0].style.backgroundColor
                    ])
                ) : undefined,
                ColorRay: window.View.ConnectionStyle.Strip ? new Api.Matrix([
                    Api.Playground.querySelectorAll(`div:not(.Line)[uid="${Connection[0]}"]`)[0].style.backgroundColor,
                    Api.Playground.querySelectorAll(`div:not(.Line)[uid="${Connection[1]}"]`)[0].style.backgroundColor,
                ]) : undefined,
                Color: Line.style.backgroundColor,
                Width: Line.style.height
            });
            NewLine.innerHTML = window.View.DisplayConnectionData.LengthData ? parseFloat(NewLine.style.transform.replace("rotate(", "").replace("deg)", "")).toFixed(1) : ""
            Line.remove();
        }
    });

    requestAnimationFrame(Loop);
}

Loop();