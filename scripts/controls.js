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
				const X1 = Connection[0].Particle.offsetLeft + Connection[0].Particle.offsetWidth / 2;
				const Y1 = Connection[0].Particle.offsetTop + Connection[0].Particle.offsetHeight / 2;
				const X2 = Connection[1].Particle.offsetLeft + Connection[1].Particle.offsetWidth / 2;
				const Y2 = Connection[1].Particle.offsetTop + Connection[1].Particle.offsetHeight / 2;

				new Api.Line(new Api.Vector4([X1, Y1, X2, Y2])).Append(Api.Playground, {
					Gradient: new Api.Gradient(
						new Api.Matrix([
							Connection[0].Color,
							Connection[1].Color,
						]),
					)
				});

				Connection = [null, null];
			}
		});

		Listeners.add(Particle);
	});

	requestAnimationFrame(Loop);
}

Loop();