const MAX_LEN = 9;
const subSet = "1234567890qwaszxerdfcvtyghbnuijknmoipklAQWZXDECRFVTGBYHNUJMIKLOP"



export function generate() {
    let genId = ""
    for(let i=0; i<MAX_LEN; i++){
        genId += subSet[Math.floor(Math.random() * subSet.length)];
    }
    return genId
}












