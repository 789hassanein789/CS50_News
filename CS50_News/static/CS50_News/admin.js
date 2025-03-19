const container = document.querySelector('.news-container');

container.addEventListener('mousedown', (e) => {
    container.dataset.mouseDownAt = e.clientX;
})

window.addEventListener('mouseup', (e) => {
    container.dataset.mouseDownAt = "0";
    container.dataset.percentage = container.dataset.newPercentage
})

container.addEventListener('mousemove', (e) => {
    if (container.dataset.mouseDownAt === "0") return

    const delta = parseFloat(container.dataset.mouseDownAt) - e.clientX;

    let percentage = (delta / window.innerWidth / 2) * -100,
          newPercentage = parseFloat(container.dataset.percentage) + percentage
    newPercentage = Math.min(newPercentage, 0)
    newPercentage = Math.max(newPercentage, -100)

    container.dataset.newPercentage = newPercentage

    container.animate({
        transform: `translate(${newPercentage}%, 0%)`
    }, {duration: 1200, fill: 'forwards'})
})

