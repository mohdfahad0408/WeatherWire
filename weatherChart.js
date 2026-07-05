/* ==========================================================================
   WEATHER DASHBOARD CHART RENDERING (weatherChart.js)
   ========================================================================== */

/**
 * Draws the SVG-based hourly temperature spline chart
 * @param {Array<number>} temps Hourly temperatures (length 9)
 * @param {string} theme Current theme ("light" or "dark")
 * @param {string} [unit='C'] Current temperature unit
 */
export function drawTemperatureChart(temps, theme, unit = 'C') {
  const container = document.getElementById("chart-container");
  if (!container) return;

  // Clear container
  container.innerHTML = "";

  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 180;
  
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "100%");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.style.overflow = "visible";
  container.appendChild(svg);

  // Time labels matching the image columns
  const timeLabels = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM", "10 PM"];
  const displayLabels = ["6 AM", "", "10 AM", "", "2 PM", "4 PM", "6 PM", "", "10 PM"];

  // Padding & boundaries
  const paddingX = 40;
  const paddingY = 40;
  const chartWidth = width - (paddingX * 2);
  const chartHeight = height - (paddingY * 2);

  // High & low bounds for vertical mapping
  const minTemp = Math.min(...temps) - 1.5;
  const maxTemp = Math.max(...temps) + 1.5;
  const tempRange = maxTemp - minTemp;

  // Compute coordinate coordinates
  const points = temps.map((temp, index) => {
    const x = paddingX + (index / (temps.length - 1)) * chartWidth;
    const y = paddingY + (1 - (temp - minTemp) / (tempRange || 1)) * chartHeight;
    return { x, y, temp, time: timeLabels[index], displayTime: displayLabels[index] };
  });

  // Create SVG Gradients Definitions
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

  // 1. Line Stroke Gradient
  const strokeGrad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  strokeGrad.setAttribute("id", "strokeGrad");
  strokeGrad.setAttribute("x1", "0%"); strokeGrad.setAttribute("y1", "0%");
  strokeGrad.setAttribute("x2", "100%"); strokeGrad.setAttribute("y2", "0%");

  const strokeStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  strokeStop1.setAttribute("offset", "0%");
  strokeStop1.setAttribute("stop-color", "#60A5FA"); // Light blue

  const strokeStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  strokeStop2.setAttribute("offset", "100%");
  strokeStop2.setAttribute("stop-color", "#2563EB"); // Strong blue

  strokeGrad.appendChild(strokeStop1);
  strokeGrad.appendChild(strokeStop2);

  // 2. Fill Gradient (fade under the line)
  const fillGrad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  fillGrad.setAttribute("id", "fillGrad");
  fillGrad.setAttribute("x1", "0%"); fillGrad.setAttribute("y1", "0%");
  fillGrad.setAttribute("x2", "0%"); fillGrad.setAttribute("y2", "100%");

  const fillStop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  fillStop1.setAttribute("offset", "0%");
  fillStop1.setAttribute("stop-color", "#3B82F6");
  fillStop1.setAttribute("stop-opacity", theme === "dark" ? "0.3" : "0.15");

  const fillStop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  fillStop2.setAttribute("offset", "100%");
  fillStop2.setAttribute("stop-color", "#3B82F6");
  fillStop2.setAttribute("stop-opacity", "0.00");

  fillGrad.appendChild(fillStop1);
  fillGrad.appendChild(fillStop2);

  defs.appendChild(strokeGrad);
  defs.appendChild(fillGrad);
  svg.appendChild(defs);

  // Draw vertical dashed gridlines
  points.forEach((p) => {
    const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gridLine.setAttribute("x1", p.x);
    gridLine.setAttribute("y1", paddingY);
    gridLine.setAttribute("x2", p.x);
    gridLine.setAttribute("y2", height - paddingY + 10);
    gridLine.setAttribute("stroke", theme === "dark" ? "#1E293B" : "#E2E8F0");
    gridLine.setAttribute("stroke-dasharray", "4,4");
    gridLine.setAttribute("stroke-width", "1");
    svg.appendChild(gridLine);
  });

  // Calculate Bezier curve paths
  let dCurve = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    
    // Smooth control points estimation
    const cpX1 = p0.x + (p1.x - p0.x) / 3;
    const cpY1 = p0.y;
    const cpX2 = p0.x + 2 * (p1.x - p0.x) / 3;
    const cpY2 = p1.y;
    
    dCurve += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  // Render Area path (gradient fill under curve)
  const areaPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const dArea = `${dCurve} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
  areaPath.setAttribute("d", dArea);
  areaPath.setAttribute("fill", "url(#fillGrad)");
  svg.appendChild(areaPath);

  // Render Stroke path (the spline curve line)
  const curveLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
  curveLine.setAttribute("d", dCurve);
  curveLine.setAttribute("fill", "none");
  curveLine.setAttribute("stroke", "url(#strokeGrad)");
  curveLine.setAttribute("stroke-width", "3");
  curveLine.setAttribute("stroke-linecap", "round");
  svg.appendChild(curveLine);

  // Create tooltip element in container if not present
  let tooltip = document.getElementById("chart-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "chart-tooltip";
    tooltip.className = "chart-tooltip";
    container.appendChild(tooltip);
  }

  // Draw X-axis text labels and node dots
  points.forEach((p, index) => {
    // 1. Time Label below chart
    if (p.displayTime) {
      const timeText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      timeText.setAttribute("x", p.x);
      timeText.setAttribute("y", height - 12);
      timeText.setAttribute("text-anchor", "middle");
      timeText.setAttribute("fill", theme === "dark" ? "#64748B" : "#94A3B8");
      timeText.setAttribute("font-size", "11");
      timeText.setAttribute("font-family", "var(--font-sans)");
      timeText.setAttribute("font-weight", "500");
      timeText.textContent = p.displayTime;
      svg.appendChild(timeText);
    }

    // 2. Temp values written directly above points
    const tempValText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tempValText.setAttribute("x", p.x);
    tempValText.setAttribute("y", p.y - 12);
    tempValText.setAttribute("text-anchor", "middle");
    tempValText.setAttribute("fill", theme === "dark" ? "#94A3B8" : "#64748B");
    tempValText.setAttribute("font-size", "11");
    tempValText.setAttribute("font-family", "var(--font-sans)");
    tempValText.setAttribute("font-weight", "600");
    tempValText.textContent = `${p.temp}°`;
    svg.appendChild(tempValText);

    // 3. Dot node circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", p.x);
    circle.setAttribute("cy", p.y);
    circle.setAttribute("r", "4.5");
    circle.setAttribute("fill", theme === "dark" ? "#0F172A" : "#FFFFFF");
    circle.setAttribute("stroke", "#3B82F6");
    circle.setAttribute("stroke-width", "2.5");
    circle.setAttribute("class", "chart-dot-node");
    circle.style.transition = "all 0.15s ease";
    svg.appendChild(circle);

    // 4. Hover columns to capture mouse interactions easily
    const triggerWidth = chartWidth / (temps.length - 1);
    const triggerRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    triggerRect.setAttribute("x", p.x - triggerWidth / 2);
    triggerRect.setAttribute("y", paddingY - 10);
    triggerRect.setAttribute("width", triggerWidth);
    triggerRect.setAttribute("height", chartHeight + 20);
    triggerRect.setAttribute("fill", "transparent");
    triggerRect.style.cursor = "pointer";

    triggerRect.addEventListener("mouseenter", (e) => {
      // Highlight dot
      circle.setAttribute("r", "6.5");
      circle.setAttribute("stroke-width", "3.5");
      circle.setAttribute("fill", "#3B82F6");

      // Show tooltip
      tooltip.innerHTML = `
        <div class="tooltip-time">${p.time}</div>
        <div class="tooltip-temp">${p.temp}°${unit}</div>
      `;
      tooltip.style.opacity = "1";

      // Position tooltip
      const rect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const leftPos = p.x - (tooltipRect.width / 2);
      const topPos = p.y - tooltipRect.height - 20;

      tooltip.style.transform = `translate(${leftPos}px, ${topPos}px)`;
    });

    triggerRect.addEventListener("mouseleave", () => {
      // Reset dot
      circle.setAttribute("r", "4.5");
      circle.setAttribute("stroke-width", "2.5");
      circle.setAttribute("fill", theme === "dark" ? "#0F172A" : "#FFFFFF");

      // Hide tooltip
      tooltip.style.opacity = "0";
    });

    svg.appendChild(triggerRect);
  });
}
