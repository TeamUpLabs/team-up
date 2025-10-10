import { Event as EventType, EventSize } from "@/types/event/Event";

/**
 * Gravitational Physics Event Sizing Algorithm
 * Each event acts as a celestial body with mass and gravitational influence
 */
export function assignEventSizes(events: EventType[]): EventType[] {
  if (events.length === 0) return events;

  // Initialize celestial bodies with mass based on event characteristics
  const celestialBodies = initializeCelestialBodies(events);

  // Simulate gravitational interactions over time
  const stabilizedBodies = simulateGravitationalEvolution(celestialBodies);

  // Extract final sizes based on orbital characteristics and mass distribution
  return extractSizesFromGravitationalSystem(stabilizedBodies);
}

/**
 * Initialize events as celestial bodies with mass and orbital properties
 */
function initializeCelestialBodies(events: EventType[]): CelestialBody[] {
  return events.map((event, index) => {
    // Calculate gravitational mass based on event importance
    const mass = calculateGravitationalMass(event);

    // Position in a spiral galaxy pattern for natural distribution
    const angle = (index / events.length) * 2 * Math.PI;
    const radius = Math.sqrt(index + 1) * 50; // Spiral arms
    const x = Math.cos(angle) * radius + Math.random() * 20 - 10;
    const y = Math.sin(angle) * radius + Math.random() * 20 - 10;

    return {
      id: event.id,
      event,
      mass,
      position: { x, y },
      velocity: {
        x: Math.sin(angle) * 2 + (Math.random() - 0.5) * 3,
        y: -Math.cos(angle) * 2 + (Math.random() - 0.5) * 3
      },
      orbitalRadius: radius,
      orbitalEnergy: 0,
      stability: 0
    };
  });
}

/**
 * Simulate gravitational evolution over multiple time steps
 */
function simulateGravitationalEvolution(bodies: CelestialBody[]): CelestialBody[] {
  const timeSteps = 15; // Evolution time
  const timeStep = 0.1;
  let currentBodies = [...bodies];

  for (let step = 0; step < timeSteps; step++) {
    currentBodies = simulateTimeStep(currentBodies, timeStep);
  }

  return currentBodies;
}

/**
 * Single time step of gravitational simulation
 */
function simulateTimeStep(bodies: CelestialBody[], dt: number): CelestialBody[] {
  const G = 6.67430e-11; // Gravitational constant (scaled for our simulation)
  const newBodies = bodies.map(body => ({ ...body }));

  // Calculate gravitational forces between all pairs
  for (let i = 0; i < bodies.length; i++) {
    let totalForceX = 0;
    let totalForceY = 0;

    for (let j = 0; j < bodies.length; j++) {
      if (i !== j) {
        const otherBody = bodies[j];
        const dx = otherBody.position.x - bodies[i].position.x;
        const dy = otherBody.position.y - bodies[i].position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
          // Gravitational force calculation
          const force = (G * bodies[i].mass * otherBody.mass) / (distance * distance);
          const forceX = force * (dx / distance);
          const forceY = force * (dy / distance);

          totalForceX += forceX;
          totalForceY += forceY;
        }
      }
    }

    // Update velocity and position
    const accelerationX = totalForceX / bodies[i].mass;
    const accelerationY = totalForceY / bodies[i].mass;

    newBodies[i].velocity.x += accelerationX * dt;
    newBodies[i].velocity.y += accelerationY * dt;
    newBodies[i].position.x += newBodies[i].velocity.x * dt;
    newBodies[i].position.y += newBodies[i].velocity.y * dt;

    // Calculate orbital characteristics
    const distanceFromCenter = Math.sqrt(
      newBodies[i].position.x ** 2 + newBodies[i].position.y ** 2
    );
    newBodies[i].orbitalRadius = distanceFromCenter;
    newBodies[i].orbitalEnergy = 0.5 * newBodies[i].mass *
      (newBodies[i].velocity.x ** 2 + newBodies[i].velocity.y ** 2) -
      (G * newBodies[i].mass * 1000) / distanceFromCenter; // Central mass assumption
  }

  return newBodies;
}

/**
 * Extract event sizes based on gravitational simulation results
 */
function extractSizesFromGravitationalSystem(bodies: CelestialBody[]): EventType[] {
  return bodies.map(body => {
    // Size determination based on orbital and gravitational characteristics
    let size: EventSize = 'medium';

    // Large celestial bodies (high mass, stable orbits)
    if (body.mass > 0.7 && body.orbitalEnergy < -50) {
      size = 'large';
    }
    // Small celestial bodies (low mass, erratic orbits)
    else if (body.mass < 0.3 || body.orbitalEnergy > 50) {
      size = 'small';
    }
    // Medium bodies (balanced characteristics)
    else {
      size = 'medium';
    }

    // Add cosmic randomness for organic feel
    if (Math.random() > 0.9) {
      const sizes: EventSize[] = ['small', 'medium', 'large'];
      const currentIndex = sizes.indexOf(size);
      size = sizes[(currentIndex + 1) % sizes.length];
    }

    return { ...body.event, size };
  });
}

/**
 * Calculate gravitational mass based on event characteristics
 */
function calculateGravitationalMass(event: EventType): number {
  const contentMass = Math.min((event.title.length + event.description.length) / 150, 0.5);
  const attendanceMass = Math.min(event.attendees / 100, 0.4);
  const typeMass = event.type === 'hackathon' ? 0.2 :
                   event.type === 'conference' ? 0.15 : 0.1;
  const priceMass = Math.min(event.price.length / 20, 0.2);

  // Add cosmic randomness
  const cosmicVariation = (Math.random() - 0.5) * 0.2;

  return Math.max(0.1, Math.min(1.0, 0.3 + contentMass + attendanceMass + typeMass + priceMass + cosmicVariation));
}

// Celestial body interface for gravitational simulation
interface CelestialBody {
  id: number;
  event: EventType;
  mass: number;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  orbitalRadius: number;
  orbitalEnergy: number;
  stability: number;
}