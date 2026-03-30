

$('#IndividualIdCardFiles').on('change', function (e) {
    //When files are selected this change event is triggered in this we
    // show items on front end
    for (var i = 0; i < this.files.length; i++) {
        /*  if(!allowedExtensions.exec(this.files.item(i).name)){*/
        var fileExtension = this.files.item(i).name.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="display: flex; justify-content: center;">
                                                                 <img src="/Content/images/pdf.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                    <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                        <div class="func">
                                                                                 <a class="image-zoom" href="` + URL.createObjectURL(this.files.item(i)) + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUploadedIdPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                     </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>`
            $("#IndividualIdCardGalleryContainer").append(imageContainer);


        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="display: flex; justify-content: center;">
                                                                 <img src="/Content/images/docs.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                      <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                 <div class="func">
                                                                                <a class="image-zoom" href="` + URL.createObjectURL(this.files.item(i)) + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUploadedIdPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                      </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#IndividualIdCardGalleryContainer").append(imageContainer);
        }
        else {

            var imageContainer = ` <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display:flex;">
                                                                  <img src="` + URL.createObjectURL(this.files.item(i)) + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                    <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" onclick="viewImage(\`` + URL.createObjectURL(this.files.item(i)) + `\`,` + i + `,value='uploadIdPicture', this)">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUploadedIdPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`


            $("#IndividualIdCardGalleryContainer").append(imageContainer);
        }


        dataTransferIndividualTenantIDCardUploadPicturesSlider.push({ path: URL.createObjectURL(this.files.item(i)), name: this.files.item(i).name });
    };

    //add all files to the dataTransferUnitUploadPictures object one by one will be using it later
    for (let file of this.files) {
        dataTransferIndividualTenantIDCardUploadPictures.items.add(file);

    }
    //set dataTransferUnitUploadPictures object to the files array
    this.files = dataTransferIndividualTenantIDCardUploadPictures.files;

    console.log(dataTransferIndividualTenantIDCardUploadPictures);
});
function removeUploadedIdPicture(imageName, eve) {
    $(eve).closest('div.col-3').remove();
    //$(eve).closest('div.img').remove();
    for (let i = 0; i < dataTransferIndividualTenantIDCardUploadPictures.items.length; i++) {
        //remove matching one from dataTransferMaintenanceUploadPictures object
        if (imageName === dataTransferIndividualTenantIDCardUploadPictures.items[i].getAsFile().name) {
            dataTransferIndividualTenantIDCardUploadPictures.items.remove(i);
            continue;
        }

    }
    console.log(dataTransferIndividualTenantIDCardUploadPictures);
    for (let i = 0; i < dataTransferIndividualTenantIDCardUploadPicturesSlider.length; i++) {
        //remove matching one from dataTransferMaintenanceUploadPicturesSlider object
        if (imageName === dataTransferIndividualTenantIDCardUploadPicturesSlider[i].name) {
            dataTransferIndividualTenantIDCardUploadPicturesSlider.splice(i, 1)
            continue;
        }
    }
    //set modified dataTransferUnitUploadPictures object to the file input back
    document.getElementById('IndividualIdCardFiles').files = dataTransferIndividualTenantIDCardUploadPictures.files;

}


$('#IndividualUploadFiles').on('change', function (e) {
    //When files are selected this change event is triggered in this we
    // show items on front end
    for (var i = 0; i < this.files.length; i++) {
        /*  if(!allowedExtensions.exec(this.files.item(i).name)){*/
        var fileExtension = this.files.item(i).name.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="display: flex; justify-content: center;">
                                                                 <img src="/Content/images/pdf.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                    <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                        <div class="func">
                                                                                 <a class="image-zoom" href="` + URL.createObjectURL(this.files.item(i)) + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUploadedPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                     </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>`
            $("#IndividualGalleryContainer").append(imageContainer);


        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="display: flex; justify-content: center;">
                                                                 <img src="/Content/images/docs.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                      <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                 <div class="func">
                                                                                <a class="image-zoom" href="` + URL.createObjectURL(this.files.item(i)) + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUploadedPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                      </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#IndividualGalleryContainer").append(imageContainer);
        }
        else {

            var imageContainer = ` <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display:flex;">
                                                                  <img src="` + URL.createObjectURL(this.files.item(i)) + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                    <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" onclick="viewImage(\`` + URL.createObjectURL(this.files.item(i)) + `\`,` + i + `,value='uploadPicture', this)">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUploadedPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`


            $("#IndividualGalleryContainer").append(imageContainer);
        }


        dataTransferIndividualPassportUploadPicturesSlider.push({ path: URL.createObjectURL(this.files.item(i)), name: this.files.item(i).name });
    };

    //add all files to the dataTransferUnitUploadPictures object one by one will be using it later
    for (let file of this.files) {
        dataTransferIndividualPassportUploadPictures.items.add(file);

    }
    //set dataTransferUnitUploadPictures object to the files array
    this.files = dataTransferIndividualPassportUploadPictures.files;

    console.log(dataTransferIndividualPassportUploadPictures);
});
function removeUploadedPicture(imageName, eve) {
    $(eve).closest('div.col-3').remove();
    //$(eve).closest('div.img').remove();
    for (let i = 0; i < dataTransferIndividualPassportUploadPictures.items.length; i++) {
        //remove matching one from dataTransferMaintenanceUploadPictures object
        if (imageName === dataTransferIndividualPassportUploadPictures.items[i].getAsFile().name) {
            dataTransferIndividualPassportUploadPictures.items.remove(i);
            continue;
        }

    }
    console.log(dataTransferIndividualPassportUploadPictures);
    for (let i = 0; i < dataTransferIndividualPassportUploadPicturesSlider.length; i++) {
        //remove matching one from dataTransferMaintenanceUploadPicturesSlider object
        if (imageName === dataTransferIndividualPassportUploadPicturesSlider[i].name) {
            dataTransferIndividualPassportUploadPicturesSlider.splice(i, 1)
            continue;
        }
    }
    //set modified dataTransferUnitUploadPictures object to the file input back
    document.getElementById('IndividualUploadFiles').files = dataTransferIndividualPassportUploadPictures.files;

}

//CallBack Area Code
var getTenantIndividualIdCardFilesByIdCallBack = function (responseJSON) {
    console.log(responseJSON.resultJSON);
    var item = responseJSON.resultJSON;
    $.each(item, function (rowIndex, rowItem) {
        var fileExtension = rowItem.OrignalName.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = ` <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="TenantIndividualID" value="`+ rowItem.ID + `" />
                                                                   <img src="/Content/images/pdf.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removenIndividualIdCardPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> `
            $("#IndividualIdCardGalleryContainer").append(imageContainer);
        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="TenantIndividualID" value="`+ rowItem.ID + `" />
                                                                    <img src="/Content/images/docs.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removenIndividualIdCardPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                         </div>
                                                      </div>`
            $("#IndividualIdCardGalleryContainer").append(imageContainer);

        }


        else {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display: flex;">
                                                                <input type="hidden" class="TenantIndividualID" value="`+ rowItem.ID + `" />
                                                                    <img src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                             <a class="image-zoom" onclick="viewImage(\`` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `\`,` + rowIndex + `,value='uploadIdPicture', this)">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removenIndividualIdCardPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#IndividualIdCardGalleryContainer").append(imageContainer);

            dataTransferIndividualTenantIDCardUploadPicturesSlider.push({ path: rowItem.RelativePath + rowItem.NewName + rowItem.Extension, name: rowItem.NewName });

        }
    })

}

var getTenantIndividualUploadFilesCallBack = function (responseJSON) {
    console.log(responseJSON.resultJSON);
    var item = responseJSON.resultJSON;
    $.each(item, function (rowIndex, rowItem) {
        var fileExtension = rowItem.OrignalName.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = ` <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="IndividualTenantPassportID" value="`+ rowItem.ID + `" />
                                                                   <img src="/Content/images/pdf.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removenIndividualTenantPassport(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> `
            $("#IndividualGalleryContainer").append(imageContainer);


        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="TenantIndividualID" value="`+ rowItem.ID + `" />
                                                                    <img src="/Content/images/docs.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removenIndividualTenantPassport(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                         </div>
                                                      </div>`
            $("#IndividualGalleryContainer").append(imageContainer);
        }
        else {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display: flex;">
                                                                <input type="hidden" class="TenantIndividualID" value="`+ rowItem.ID + `" />
                                                                    <img src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                             <a class="image-zoom" onclick="viewImage(\`` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `\`,` + rowIndex + `,value='uploadPicture', this)">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removenIndividualTenantPassport(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`


            $("#IndividualGalleryContainer").append(imageContainer);
            dataTransferIndividualPassportUploadPicturesSlider.push({ path: rowItem.RelativePath + rowItem.NewName + rowItem.Extension, name: rowItem.NewName });
        }
    })

}
//End CallBack Code area

//Individual  Remove Code

function removenIndividualTenantPassport(imageName, eve) {
    debugger
    if ($(eve).closest('div.img').find('input.IndividualTenantPassportID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.IndividualTenantPassportID').val());
    }
    else {
        for (let i = 0; i < dataTransferIndividualPassportUploadPictures.items.length; i++) {
            //remove matching one from dataTransferUnitUploadPictures object
            if (imageName === dataTransferIndividualPassportUploadPictures.items[i].getAsFile().name) {
                dataTransferIndividualPassportUploadPictures.items.remove(i);
                continue;
            }
        }

        //set modified dataTransferUnitUploadPictures object to the file input back
        document.getElementById('IndividualUploadFiles').files = dataTransferIndividualPassportUploadPictures.files;
    }
    for (let i = 0; i < dataTransferIndividualPassportUploadPicturesSlider.length; i++) {
        //remove matching one from dataTransferUnitUploadPicturesSlider object
        if (imageName === dataTransferIndividualPassportUploadPicturesSlider[i].name) {
            dataTransferIndividualPassportUploadPicturesSlider.splice(i, 1);
            continue;
        }
    }
    //$(eve).closest('div.img').remove();   
    $(eve).closest('div.col-3').remove();
}


function removenIndividualIdCardPicture(imageName, eve) {
    debugger
    if ($(eve).closest('div.img').find('input.TenantIndividualID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.TenantIndividualID').val());
    }
    else {
        for (let i = 0; i < dataTransferIndividualTenantIDCardUploadPictures.items.length; i++) {
            //remove matching one from dataTransferUnitUploadPictures object
            if (imageName === dataTransferIndividualTenantIDCardUploadPictures.items[i].getAsFile().name) {
                dataTransferIndividualTenantIDCardUploadPictures.items.remove(i);
                continue;
            }
        }

        //set modified dataTransferUnitUploadPictures object to the file input back
        document.getElementById('IndividualIdCardFiles').files = dataTransferIndividualTenantIDCardUploadPictures.files;
    }
    for (let i = 0; i < dataTransferIndividualTenantIDCardUploadPicturesSlider.length; i++) {
        //remove matching one from dataTransferUnitUploadPicturesSlider object
        if (imageName === dataTransferIndividualTenantIDCardUploadPicturesSlider[i].name) {
            dataTransferIndividualTenantIDCardUploadPicturesSlider.splice(i, 1);
            continue;
        }
    }
    //$(eve).closest('div.img').remove();   
    $(eve).closest('div.col-3').remove();
}

//Remove Code

function viewImage(imagePath, imageIndex = 0, value) {
    _viewImagebyArrayName = value;
    $("#pictureModal").modal('show');
    $('#imageView').attr('src', imagePath);

    _selectedImageIndex = imageIndex;

}
function nextImageView() {
    if (_viewImagebyArrayName == 'uploadPicture') {

        _selectedImageIndex++; //Increment the index by 1
        if (_selectedImageIndex == dataTransferIndividualPassportUploadPicturesSlider.length) {


            _selectedImageIndex = 0;

        }
        var imagePath = dataTransferIndividualPassportUploadPicturesSlider[_selectedImageIndex].path; //URL.createObjectURL(dataTransferUnitUploadPicturesSlider.files[_selectedImageIndex]);
        $('#imageView').attr('src', imagePath);

        //$('#imageView').animate({ transition: '1s ease-in-out' }, 'slow', 500, function () {
        //    console.log("first step complete");

        //});

    }
    else if (_viewImagebyArrayName == 'uploadIdPicture') {
        _selectedImageIndex++; //Increment the index by 1
        if (_selectedImageIndex == dataTransferIndividualTenantIDCardUploadPicturesSlider.length) {

            _selectedImageIndex = 0;
        }
        var imagePath = dataTransferIndividualTenantIDCardUploadPicturesSlider[_selectedImageIndex].path;//URL.createObjectURL(dataTransferUnitCoverPictures.files[_selectedImageIndex]);

        $('#imageView').attr('src', imagePath);
    }
}

function previousImageView() {
    if (_viewImagebyArrayName == 'uploadPicture') {

        _selectedImageIndex--; //Increment the index by 1
        if (_selectedImageIndex < 0) {

            _selectedImageIndex = dataTransferIndividualPassportUploadPicturesSlider.length - 1;
        }
        var imagePath = dataTransferIndividualPassportUploadPicturesSlider[_selectedImageIndex].path;// URL.createObjectURL(dataTransferUnitUploadPicturesSlider.files[_selectedImageIndex]);
        $('#imageView').attr('src', imagePath);

    }

    else if (_viewImagebyArrayName == 'uploadIdPicture') {
        _selectedImageIndex--; //Increment the index by 1
        if (_selectedImageIndex < 0) {

            _selectedImageIndex = dataTransferIndividualTenantIDCardUploadPicturesSlider.length - 1;
        }
        var imagePath = dataTransferIndividualTenantIDCardUploadPicturesSlider[_selectedImageIndex].path;//URL.createObjectURL(dataTransferUnitCoverPictures.files[_selectedImageIndex]);

        $('#imageView').attr('src', imagePath);
    }
}

function deleteUploadedFile(id = 0) {
    ajaxRequest({ url: "/RealEstate/File/Delete", type: 'POST', data: { ID: id }, callBack: deleteUploadedFileCallBack });
}
var deleteUploadedFileCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        successToastr(responseJSON.Message, 'success');
    }
    else {
        errorToastr(responseJSON.Message, responseJSON.Type);

    }
}