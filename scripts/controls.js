import * as Api from "./api.js";
import * as Rom from "./rom.js";

let Placing = [false, null];
let Connection = [null, null];
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
});

function Loop() {
	if (Placing[0]) Api.PlaceButton.innerHTML = "Click to place"
	else Api.PlaceButton.innerHTML = "Place";

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

	requestAnimationFrame(Loop);
}

Loop();