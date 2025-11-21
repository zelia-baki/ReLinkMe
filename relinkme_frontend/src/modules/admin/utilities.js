export function europeanDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    return `${day}-${month}-${year}\n${hours}:${minutes}:${seconds}.${milliseconds}`;

}
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatForNivo(offre, candidature) {
    const createBase = () =>
        Array.from({ length: 12 }, (_, i) => ({
            x: MONTH_NAMES[i],
            y: 0
        }));

    const offreData = createBase();
    const candidatureData = createBase();

    offre.forEach(item => {
        const idx = item.month - 1; 
        offreData[idx].y = item.count;
    });

    
    candidature.forEach(item => {
        const idx = item.month - 1;
        candidatureData[idx].y = item.count;
    });

    return [
        {
            id: "offres",
            data: offreData
        },
        {
            id: "candidatures",
            data: candidatureData
        }
    ];
}