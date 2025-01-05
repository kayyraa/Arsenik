import * as Api from "./api.js";
import * as Rom from "./rom.js";

let Placing = [false, null];
let Connection = [null, null];
let SelectionBox = [false, false, [0, 0, 0, 0], []];
const Listeners = new WeakSet();

Api.PlaceButton.addEventListener("mousedown", () => {
	if (!Api.ElementSelectionInput.value) return;
	Placing = [true, Api.ElementSelectionInput.value];
});

Api.Playground.addEventListener("mousedown", (Event) => {
	if (!Placing[0] || !Placing[1]) return;

	const Element = Rom.Elements.find((Object) => Object.Symbol === Placing[1]);
	if (!Element) return;

	Placing = [false, null];
	new Api.Particle(
		Element,
		new Api.Vector2([
			Event.clientX - (Api.Playground.offsetLeft + (Element.Radius * Rom.RadiusConstant / 2)),
			Event.clientY - (Api.Playground.offsetTop + (Element.Radius * Rom.RadiusConstant / 2)),
		])
	).Append();
});

document.addEventListener("keydown", (Event) => {
	if (Event.key === " ") window.Simulation.Playing = !window.Simulation.Playing;
	else if (Event.key === "c") Api.Playground.innerHTML = "";
	else if (Event.key === "Shift") SelectionBox[1] = true;
	else if (Event.key === "Delete") SelectionBox[3].forEach(Particle => Particle.remove());
});

document.addEventListener("keyup", (Event) => {
	if (Event.key === "Shift") SelectionBox[1] = false;
});

["mousedown", "touchstart"].forEach(EventType => {
	Api.Playground.addEventListener(EventType, (Event) => {
		if (Event.button === 2) {
			SelectionBox = [false, false, [0, 0, 0, 0], []];
		} else if (Event.button === 0) {
			const StartX = Event.touches ? Event.touches[0].clientX : Event.clientX;
			const StartY = Event.touches ? Event.touches[0].clientY : Event.clientY;
			SelectionBox = [true, SelectionBox[1], [StartX, StartY, 0, 0], []];
		}
	});
});

["mouseup", "touchend", "touchcancel"].forEach(EventType => {
	Api.Playground.addEventListener(EventType, () => {
		SelectionBox = [false, false, [0, 0, 0, 0], SelectionBox[3]];
		Api.SelectionBox.style.display = "none";
	});
});

["mousemove", "touchmove"].forEach(EventType => {
	Api.Playground.addEventListener(EventType, (Event) => {
		if (!SelectionBox[0]) return;

		const CurrentX = Event.touches ? Event.touches[0].clientX : Event.clientX;
		const CurrentY = Event.touches ? Event.touches[0].clientY : Event.clientY;

		const StartX = SelectionBox[2][0];
		const StartY = SelectionBox[2][1];

		let Width = Math.abs(CurrentX - StartX);
		let Height = Math.abs(CurrentY - StartY);

		let Left = Math.min(StartX, CurrentX);
		let Top = Math.min(StartY, CurrentY);

		if (SelectionBox[1]) Height = Width;

		Api.SelectionBox.style.display = "";
		Api.SelectionBox.style.left = `${Left}px`;
		Api.SelectionBox.style.top = `${Top}px`;
		Api.SelectionBox.style.width = `${Width}px`;
		Api.SelectionBox.style.height = `${Height}px`;

		SelectionBox[2] = [Left, Top, Width, Height];
	});
});

function Loop() {
	if (Placing[0]) Api.PlaceButton.innerHTML = "Click to place"
	else Api.PlaceButton.innerHTML = "Place";

	if (!SelectionBox[0]) Api.SelectionBox.style.display = "none";
	else Api.SelectionBox.style.display = "";

	Array.from(Api.Playground.children).forEach((Particle) => {
		if (Listeners.has(Particle)) return;

		Particle.addEventListener("mousedown", () => {
			if (!Connection[0]) {
				Connection[0] = {
					Particle,
					Color: Rom.Elements.find((Object) => Object.Symbol === Particle.innerHTML)?.Color || "rgb(255, 255, 255)",
				};
				return;
			}

			if (!Connection[1]) {
				Connection[1] = {
					Particle,
					Color: Rom.Elements.find((Object) => Object.Symbol === Particle.innerHTML)?.Color || "rgb(255, 255, 255)",
				};
				return;
			}

			if (Connection[0] && Connection[1]) {
				new Api.Line(undefined, [Connection[0].Particle, Connection[1].Particle]).Connect(Api.Playground, {
					Gradient: window.View.ConnectionStyle.Gradient ? new Api.Gradient(
						new Api.Matrix([
							Connection[0].Color,
							Connection[1].Color,
						])
					) : undefined,
					ColorRay: window.View.ConnectionStyle.Strip ? new Api.Matrix([
						Connection[0].Color,
						Connection[1].Color,
					]) : undefined
				});

				Connection = [null, null];
			}
		});

		Listeners.add(Particle);
	});

    Array.from(Api.Playground.children).forEach((Element) => {
		if (
			Element.getBoundingClientRect().left >= SelectionBox[2][0] &&
			Element.getBoundingClientRect().top >= SelectionBox[2][1] &&
			Element.getBoundingClientRect().right <= SelectionBox[2][0] + SelectionBox[2][2] &&
			Element.getBoundingClientRect().bottom <= SelectionBox[2][1] + SelectionBox[2][3]
		) {
			if (!SelectionBox[3].includes(Element)) SelectionBox[3].push(Element);
		}
	});

	requestAnimationFrame(Loop);
}

Loop();