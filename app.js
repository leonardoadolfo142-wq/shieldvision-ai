// ShieldVision AI - Main Application

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🛡️ ShieldVision AI initialized');
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    drawGlobe();
    initializeAICopilot();
}

// Setup Event Listeners
function setupEventListeners() {
    const copilotBtn = document.getElementById('copilotBtn');
    const copilotInput = document.getElementById('copilotInput');

    if (copilotBtn) {
        copilotBtn.addEventListener('click', handleCopilotSubmit);
    }

    if (copilotInput) {
        copilotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleCopilotSubmit();
            }
        });
    }
}

// Draw Globe Canvas
function drawGlobe() {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    let rotation = 0;

    function animate() {
        // Clear canvas
        ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw rotating globe
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;

        // Globe background
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 102, 255, 0.1)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Globe grid lines
        ctx.strokeStyle = 'rgba(0, 102, 255, 0.2)';
        ctx.lineWidth = 1;

        // Longitude lines
        for (let i = 0; i < 360; i += 30) {
            const angle = (i + rotation) * Math.PI / 180;
            const x1 = centerX + radius * Math.cos(angle);
            const y1 = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }

        // Latitude circles
        for (let i = 2; i <= 5; i++) {
            const r = (i / 6) * radius;
            ctx.beginPath();
            ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
            ctx.stroke();
        }

        // Threat markers
        drawThreatMarkers(ctx, centerX, centerY, radius, rotation);

        // Rotation info
        ctx.fillStyle = 'rgba(0, 102, 255, 0.8)';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('Rotating...', centerX - 30, centerY + radius + 25);

        rotation += 0.5;
        if (rotation >= 360) rotation = 0;

        requestAnimationFrame(animate);
    }

    animate();
}

// Draw threat markers on globe
function drawThreatMarkers(ctx, centerX, centerY, radius, rotation) {
    const threats = [
        { name: 'US', lat: 40, lon: -95, severity: 'high' },
        { name: 'EU', lat: 50, lon: 10, severity: 'medium' },
        { name: 'ASIA', lat: 35, lon: 120, severity: 'low' },
        { name: 'AU', lat: -25, lon: 135, severity: 'high' }
    ];

    threats.forEach(threat => {
        const angle = ((threat.lon + rotation) * Math.PI / 180);
        const latRad = threat.lat * Math.PI / 180;

        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(latRad);

        // Threat marker
        ctx.fillStyle =
            threat.severity === 'high' ? 'rgba(255, 68, 68, 0.8)' :
                threat.severity === 'medium' ? 'rgba(255, 170, 0, 0.8)' :
                    'rgba(0, 221, 136, 0.8)';

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.strokeStyle =
            threat.severity === 'high' ? 'rgba(255, 68, 68, 0.4)' :
                threat.severity === 'medium' ? 'rgba(255, 170, 0, 0.4)' :
                    'rgba(0, 221, 136, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.stroke();
    });
}

// AI Copilot
function initializeAICopilot() {
    console.log('🤖 AI Copilot initialized');
}

function handleCopilotSubmit() {
    const input = document.getElementById('copilotInput');
    const message = input.value.trim();

    if (!message) return;

    console.log('User message:', message);

    // Simulate AI response
    const responses = [
        'Your security score has improved by 5% this week. I recommend enabling two-factor authentication on all accounts.',
        'I detected potential DNS poisoning. I recommend updating your DNS settings to block malicious domains.',
        'Your SSL certificate will expire in 30 days. I recommend renewing it immediately.',
        'I found an outdated WordPress plugin that poses a security risk. Please update or disable it.',
        'Your firewall rules are blocking too much legitimate traffic. Let me help optimize them.'
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Update copilot response
    const responseDiv = document.querySelector('.copilot-response');
    if (responseDiv) {
        responseDiv.innerHTML = `<p>${randomResponse}</p>`;
    }

    // Clear input
    input.value = '';
    input.focus();
}

// Utility Functions
function logEvent(event, data = {}) {
    console.log(`📊 Event: ${event}`, data);
}

// Export for debugging
window.ShieldVisionAI = {
    logEvent,
    drawGlobe,
    handleCopilotSubmit
};
