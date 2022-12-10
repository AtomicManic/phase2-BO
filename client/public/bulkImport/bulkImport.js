
const uploadFileEle = document.getElementById("fileInput"); //for upload file
const uploadFileForm = document.getElementById('uploadFileForm');
const errMsg = document.getElementById("errMsg");
const declineMsg = document.getElementById("declineMsg");
const validMsg = document.getElementById("validMsg");

uploadFileForm.addEventListener("submit" , async e => {
    e.preventDefault();

    if (!uploadFileEle.value) {
        e.preventDefault();
        errMsg.style.display = "block";
    }

    else
    {
        try {

            const fileName = uploadFileEle.files[0].name;

            console.log(JSON.stringify(fileName)); //ok

            const data = await bulkImport(fileName);

            if (!data){
                errMsg.style.display = "block";
            }

             else if (data.message === "failed") {
                declineMsg.style.display = "block";
            }
            else {
                validMsg.style.display = "block";
            }
        } catch (err) {
            throw err
        }
    }
});


uploadFileEle.addEventListener("focus" , () => {
    errMsg.style.display = "none";
    validMsg.style.display = "none";
    declineMsg.style.display = "none";
});


const bulkImport = async (fileName) => {
    const response = await fetch(
        `http://localhost:4000/api/user/bulk-import/${fileName}`  ,{
            method: "post",
            headers: {
                "Content-Type": "application/json"
            }
        });

    return response.json();
};
