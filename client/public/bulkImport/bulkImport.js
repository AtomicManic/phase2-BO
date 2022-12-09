
const uploadFileEle = document.getElementById("fileInput"); //for upload file
const uploadFileForm = document.getElementById('uploadFileForm');
const errMsg = document.getElementById("errMsg");
const validMsg = document.getElementById("validMsg");


uploadFileForm.addEventListener("submit" , async e => {
    e.preventDefault();

    const file = {
        filename: uploadFileEle.files[0].name
    };

    console.log(file.filename);

try {

    if (!(file)) {
        e.preventDefault();
        errMsg.style.display = "block";
    }
    else {
        const response = await result(file);

        if (!response || response.message("failed to inset new users")) {
            errMsg.style.display = "block";
        } else if (response.message === "bulk complete") {
            validMsg.style.display = "block";
        }
    }
}catch (err) {
    throw err
}
});

uploadFileEle.addEventListener("focus", (e) => {
    e.preventDefault();
    errMsg.style.display = "none";
    validMsg.style.display = "none";
});

const result = async (file) => {
    const bulkResponse = await fetch(
        'http://localhost:4000/api/user/bulk-import'  ,{
            method: 'post',
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS' },
            mode: 'no-cors',
            body: JSON.stringify(file.filename), //undefined in users controller?!
        });

    return bulkResponse.json();
};
