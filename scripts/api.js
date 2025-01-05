import * as Rom from "./rom.js";

export const PlaceButton = document.querySelector(".PlaceButton");
export const DisplayConnectionLength = document.querySelector(".DisplayConnectionLength");
export const SimulationStartButton = document.querySelector(".SimulationStartButton");

export const SimulationStepSizeInput = document.querySelector(".SimulationStepSizeInput");

export const ElementSelectionInput = document.querySelector(".ElementSelectionInput");
export const SelectionBox = document.querySelector(".SelectionBox");
export const Playground = document.querySelector(".Playground");
export const Sidebar = document.querySelectorAll("sidebar")[0];

String.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
window.View = {
    DisplayConnectionData: {
        LengthData: false
    },
    DisplayAtomData: {
        SymbolData: true,
    },
    ConnectionStyle: {
        Strip: false,
        Gradient: true
    }
}
window.Simulation = {
    Playing: false,
    StepSize: 40
}

export class Vector2 {
    constructor(Vector = [0, 0]) {
        this.Vector = Vector;
    }

    get Angle() {
        return Math.atan2(this.Vector[1], this.Vector[0]) * (180 / Math.PI);
    }

    get Magnitude() {
        return Math.sqrt(Math.pow(this.Vector[0], 2) + Math.pow(this.Vector[1], 2));
    }
}

export class Vector4 {
    constructor(Vector = [0, 0, 0, 0]) {
        this.Vector = Vector;
    }

    get Magnitude() {
        return Math.sqrt(
            Math.pow(this.Vector[2] - this.Vector[0], 2) +
            Math.pow(this.Vector[3] - this.Vector[1], 2)
        );
    }

    get Angle() {
        const X1 = this.Vector[0];
        const Y1 = this.Vector[1];
        const X2 = this.Vector[2];
        const Y2 = this.Vector[3];
        return Math.atan2(Y2 - Y1, X2 - X1);
    }
}

export class Matrix {
	constructor(Matrix = []) {
		this.Matrix = Matrix;
	}
}

export class Gradient {
	constructor(Color = new Matrix()) {
		this.ColorMatrix = Color;
	}
}

export class Line {
    constructor(Pos = undefined || new Vector4(), Connection = undefined || [HTMLElement, HTMLElement]) {
        this.X1 = Pos.Vector[0];
        this.Y1 = Pos.Vector[1];
        this.X2 = Pos.Vector[2];
        this.Y2 = Pos.Vector[3];
        this.Connection = Connection;
        this.Element = null;
    }

    Append(
        Parent = undefined,
        Style = {
            Gradient: new Gradient(new Matrix(["rgb(90, 90, 90)", "rgb(70, 70, 70)", "rgb(90, 90, 90)"])),
            Color: "rgb(70, 70, 70)",
            Width: "8px"
        }
    ) {
        const Line = document.createElement("div");
        Line.classList.add("Line");

        const DeltaX = this.X2 - this.X1;
        const DeltaY = this.Y2 - this.Y1;
        const Length = Math.sqrt(DeltaX ** 2 + DeltaY ** 2);
        const Angle = Math.atan2(DeltaY, DeltaX) * (180 / Math.PI);

        Line.innerHTML = "<span></span>";
        Line.style.left = `${this.X1}px`;
        Line.style.top = `${this.Y1}px`;
        Line.style.width = `${Length}px`;
        Line.style.height = Style.Width || "8px";
        Line.style.transform = `rotate(${Angle}deg)`;

        if (Style.Gradient && Style.Gradient.ColorMatrix.Matrix.length > 0) Line.style.backgroundImage = `linear-gradient(to right, ${Style.Gradient.ColorMatrix.Matrix.join(", ")})`;
        else Line.style.backgroundColor = Style.Color;

        if (Parent) Parent.appendChild(Line);
        else document.body.appendChild(Line);

        this.Element = Line;
        return Line;
    }

    Connect(
        Parent = undefined,
        Style = {
            Gradient: new Gradient(new Matrix(["rgb(90, 90, 90)", "rgb(70, 70, 70)", "rgb(90, 90, 90)"])),
            ColorRay: new Matrix(["rgb(90, 90, 90)", "rgb(90, 90, 90)", "rgb(90, 90, 90)"]),
            Color: "rgb(70, 70, 70)",
            Width: "8px"
        }
    ) {
        if (!this.Connection) return;

        const Line = document.createElement("div");
        Line.classList.add("Line");

        const X1 = this.Connection[0].offsetLeft + this.Connection[0].offsetWidth / 2;
        const Y1 = this.Connection[0].offsetTop + this.Connection[0].offsetHeight / 2;
        const X2 = this.Connection[1].offsetLeft + this.Connection[1].offsetWidth / 2;
        const Y2 = this.Connection[1].offsetTop + this.Connection[1].offsetHeight / 2;

        const DeltaX = X2 - X1;
        const DeltaY = Y2 - Y1;
        const Length = Math.sqrt(DeltaX ** 2 + DeltaY ** 2);
        const Angle = Math.atan2(DeltaY, DeltaX) * (180 / Math.PI);

        Line.innerHTML = "<span></span>";
        Line.style.left = `${X1}px`;
        Line.style.top = `${Y1}px`;
        Line.style.width = `${Length}px`;
        Line.style.height = Style.Width || "8px";
        Line.style.transform = `rotate(${Angle}deg)`;
        Line.setAttribute("Connection", JSON.stringify([this.Connection[0].getAttribute("uid"), this.Connection[1].getAttribute("uid")]));

        if (Style.Gradient && Style.Gradient.ColorMatrix.Matrix.length > 0) Line.style.backgroundImage = `linear-gradient(to right, ${Style.Gradient.ColorMatrix.Matrix.join(", ")})`;
        else Line.style.backgroundColor = Style.Color;

        if (Style.ColorRay && Style.ColorRay.Matrix) {
            const ColorBand = document.createElement("div");
            ColorBand.classList.add("Band");
            Line.appendChild(ColorBand);

            Line.style.backgroundColor = Style.ColorRay.Matrix[0];
            Style.ColorRay.Matrix.forEach(Color => {
                const ColorStrip = document.createElement("div");
                ColorStrip.style.backgroundColor = Color;
                ColorStrip.classList.add("Strip");
                ColorBand.appendChild(ColorStrip);
            });
        }

        if (Parent) Parent.appendChild(Line);
        else document.body.appendChild(Line);

        this.Element = Line;
        return Line;
    }

    Update() {
		if (!this.Connection || !this.Line) return;

		const X1 = this.Connection[0].offsetLeft + this.Connection[0].offsetWidth / 2;
		const Y1 = this.Connection[0].offsetTop + this.Connection[0].offsetHeight / 2;
		const X2 = this.Connection[1].offsetLeft + this.Connection[1].offsetWidth / 2;
		const Y2 = this.Connection[1].offsetTop + this.Connection[1].offsetHeight / 2;

		const DeltaX = X2 - X1;
		const DeltaY = Y2 - Y1;
		const Length = Math.sqrt(DeltaX ** 2 + DeltaY ** 2);
		const Angle = Math.atan2(DeltaY, DeltaX) * (180 / Math.PI);

		this.Element.style.left = `${X1}px`;
		this.Element.style.top = `${Y1}px`;
		this.Element.style.width = `${Length}px`;
		this.Element.style.transform = `rotate(${Angle}deg)`;
	}

    get Angle() {
        return parseFloat(this.Element.style.transform.replace("rotate(", "").replace("deg)", ""));
    }

    get Length() {
        return parseFloat(this.Element.style.width);
    }
}

export function GetElementObject(Name = "") {
    return Rom.Elements.find((Element) => Element.Name === Name);
}

export class Particle {
    constructor(
        Element = GetElementObject(),
        Pos = new Vector2()
    ) {
        this.Pos = Pos;
        this.Element = Element;
    }

    Append() {
        if (!this.Element || !this.Pos) return;

        const Brightness = this.Element.Color.slice(4, -1).split(",").reduce((Acc, Value, Index) => Acc + [0.2126, 0.7152, 0.0722][Index] * parseInt(Value, 10), 0);

        const Particle = document.createElement("div");
        Particle.style.backgroundColor = this.Element.Color;
        Particle.style.width = `${this.Element.Radius * Rom.RadiusConstant}px`;
        Particle.style.left = `${this.Pos.Vector[0]}px`;
        Particle.style.top = `${this.Pos.Vector[1]}px`;
        Particle.style.color = Brightness > 128 ? `rgb(${255 - Brightness}, ${255 - Brightness}, ${255 - Brightness})` : "";
        Particle.innerHTML = this.Element.Symbol;
        Particle.classList.add("Particle");
        Particle.setAttribute("Radius", this.Element.Radius * Rom.RadiusConstant);
        Particle.setAttribute("Uid", Encrypt.GenerateUid(6));
        Playground.appendChild(Particle);
    }
}

export class Encrypt {
    constructor(String = "") {
        this.String = String;
    }

    static GenerateUid(Length = 6) {
        let Uid = "";
        for (let Index = 0; Index < Length; Index++) {
            Uid += String.characters[Math.floor(Math.random() * String.characters.length)];
        }
        return Uid;
    }

    Base64Encode() {
        return btoa(this.String);
    }

    Base64Decode() {
        return atob(this.String);
    }
}