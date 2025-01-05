import * as Api from "./api.js";

Api.SimulationStartButton.addEventListener("click", () => {
	window.Simulation.Playing = !window.Simulation.Playing;
	Api.SimulationStartButton.innerHTML = window.Simulation.Playing ? "Stop" : "Start";
});

Api.SimulationStepSizeInput.addEventListener("input", () => {
	window.Simulation.StepSize = parseInt(Api.SimulationStepSizeInput.value);
});

const G = 1.5;
const Elasticity = 0.5;

function Loop() {
	if (!window.Simulation.Playing) {
		setTimeout(Loop, window.Simulation.StepSize);
		return;
	}

	const Particles = Array.from(Api.Playground.querySelectorAll("div:not(.Line)"));

	Particles.forEach(Particle => {
		if (!Particle.Velocity) {
			Particle.Velocity = { X: 0, Y: 0 };
		}
	});

	Particles.forEach((ParticleA, IndexA) => {
		const RadiusA = parseFloat(ParticleA.style.width);
		const MassA = Math.PI * RadiusA ** 2;

		Particles.forEach((ParticleB, IndexB) => {
			if (IndexA === IndexB) return;

			const RadiusB = parseFloat(ParticleB.style.width);
			const MassB = Math.PI * RadiusB ** 2;

			const ConnectedLine = Array.from(Api.Playground.querySelectorAll("div.Line")).find(Line => {
				const Connection = JSON.parse(Line.getAttribute("Connection"));
				return Connection[0] === ParticleA.getAttribute("Uid") && Connection[1] === ParticleB.getAttribute("Uid");
			});	

			const PosA = {
				X: parseFloat(ParticleA.style.left),
				Y: parseFloat(ParticleA.style.top),
			};
			const PosB = {
				X: parseFloat(ParticleB.style.left),
				Y: parseFloat(ParticleB.style.top),
			};

			const DeltaX = PosB.X - PosA.X;
			const DeltaY = PosB.Y - PosA.Y;
			const Distance = Math.sqrt(DeltaX ** 2 + DeltaY ** 2);

			let BondStrength = 1;
			if (ConnectedLine) BondStrength = Math.max(Math.abs(parseFloat(ConnectedLine.style.width)) / 100, 1);

			if (Distance <= (RadiusA + RadiusB) / 3) {
				const NormalX = DeltaX / Distance;
				const NormalY = DeltaY / Distance;

				const RelativeVelocityX = ParticleB.Velocity.X - ParticleA.Velocity.X;
				const RelativeVelocityY = ParticleB.Velocity.Y - ParticleA.Velocity.Y;
				const RelativeNormalVelocity = RelativeVelocityX * NormalX + RelativeVelocityY * NormalY;

				if (RelativeNormalVelocity < 0) {
					const Impulse = (-(1 + Elasticity) * RelativeNormalVelocity) / (1 / MassA + 1 / MassB);

					ParticleA.Velocity.X -= (Impulse / MassA) * NormalX;
					ParticleA.Velocity.Y -= (Impulse / MassA) * NormalY;

					ParticleB.Velocity.X += (Impulse / MassB) * NormalX;
					ParticleB.Velocity.Y += (Impulse / MassB) * NormalY;
				}
			} else {
				const Force = ((G * MassA * MassB) / Distance ** 2) * BondStrength;

				const Acceleration = {
					X: (Force / MassA) * (DeltaX / Distance),
					Y: (Force / MassA) * (DeltaY / Distance),
				};

				ParticleA.Velocity.X += Acceleration.X;
				ParticleA.Velocity.Y += Acceleration.Y;
			}
		});
	});

	Particles.forEach(Particle => {
		const NewPosX = parseFloat(Particle.style.left) + Particle.Velocity.X;
		const NewPosY = parseFloat(Particle.style.top) + Particle.Velocity.Y;

		Particle.style.left = `${NewPosX}px`;
		Particle.style.top = `${NewPosY}px`;
	});

	setTimeout(Loop, window.Simulation.StepSize);
}

Loop();