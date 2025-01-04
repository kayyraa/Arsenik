import * as Rom from "./rom.js";

export const PlaceButton = document.querySelector(".PlaceButton");
export const DisplayConnectionLength = document.querySelector(".DisplayConnectionLength");
export const DisplayConnectionAtomCount = document.querySelector(".DisplayConnectionAtomCount");

export const ElementSelectionInput = document.querySelector(".ElementSelectionInput");
export const Playground = document.querySelector(".Playground");

window.View = {
    DisplayConnectionData: {
        AtomCountData: false,
        LengthData: true
    },
    DisplayAtomData: {
        RadiusData: false,
        SymbolData: true,
    },
    DisplayMoleculeData: false,
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
	constructor(Pos = new Vector4()) {
		this.X1 = Pos.Vector[0];
		this.Y1 = Pos.Vector[1];
		this.X2 = Pos.Vector[2];
		this.Y2 = Pos.Vector[3];
	}

	Append(
		Parent = undefined,
		Style = {
			Gradient: undefined || new Gradient(new Matrix(["rgb(90, 90, 90)", "rgb(70, 70, 70)", "rgb(90, 90, 90)"])),
			Color: undefined || "rgb(70, 70, 70)",
			Width: undefined || "8px",
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
        Playground.appendChild(Particle);
    }
}