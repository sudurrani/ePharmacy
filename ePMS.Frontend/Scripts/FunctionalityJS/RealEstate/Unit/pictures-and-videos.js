/*
var _selectedImageIndex = 0;
var _viewImagebyArrayName = 0;
var videoURLCallBack = function (responseJSON,options) {
    uploadFiles({ inputID: 'CoverPictures', entity: 'UnitCoverPictures', fKey: $('#UnitID').val(), callBack: coverPicturesCallBack, isCloseAndSaveAsDraft: options.isCloseAndSaveAsDraft });
}
var coverPicturesCallBack = function (responseJSON,options) {
    uploadFiles({ inputID: 'UploadPictures', entity: 'UnitUploadPictures', fKey: $('#UnitID').val(), callBack: uploadPicturesCalBack, isCloseAndSaveAsDraft: options.isCloseAndSaveAsDraft });
}
var uploadPicturesCalBack = function (responseJSON,options) {
    swal.fire("", responseJSON.Message, 'success');
    if (options.isCloseAndSaveAsDraft) {
        setTimeout(function () {
            window.location.href = '/RealEstate/Unit/List?FID=cgKWwAGqpX2C4N74K+dafw==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
        }, 2000);
    }
    else {
        clearFormFields();
    }
}

$("#UploadPictures").on('change', function (e) {
    //When files are selected this change event is triggered in this we
    // show items on front end
    for (var i = 0; i < this.files.length; i++) {
        //  if(!allowedExtensions.exec(this.files.item(i).name)){
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
            $("#UnitPictureGalleryContainer").append(imageContainer);


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
            $("#UnitPictureGalleryContainer").append(imageContainer);
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
                                                                                <a class="image-zoom" onclick="viewImage(\`` + URL.createObjectURL(this.files.item(i)) + `\`,` + i +`,value='uploadPicture', this)">
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


            $("#UnitPictureGalleryContainer").append(imageContainer);
        }

        //let fileBlock = $('<span/>', { class: 'file-block' }),
        //fileName = $('<span/a>', { class: 'name', text: this.files.item(i).name });
        //fileBlock.append('<span class="file-delete"><span>+</span></span>')
        //    .append(fileName).append(`<a href="#" onclick="viewUploadedPicture( \`` + URL.createObjectURL(this.files.item(i)) + `\`)" style="position:absolute;right:12;">View </a>`);
        //$("#filesList > #fileName").append(fileBlock);
        dataTransferUnitUploadPicturesSlider.push({ path: URL.createObjectURL(this.files.item(i)), name: this.files.item(i).name });
    };

    //add all files to the dataTransferUnitUploadPictures object one by one will be using it later
    for (let file of this.files) {        
        dataTransferUnitUploadPictures.items.add(file);
        
    }
    //set dataTransferUnitUploadPictures object to the files array
    this.files = dataTransferUnitUploadPictures.files;


    //$('a.file-delete').click(function () {
    //    debugger
    //    let name = $(this).next('span.name').text();

    //    $(this).parent().remove();
    //    for (let i = 0; i < dataTransfer.items.length; i++) {
    //        //remove matching one from dataTransfer object
    //        if (name === dataTransfer.items[i].getAsFile().name) {
    //            dataTransfer.items.remove(i);
    //            continue;
    //        }
    //    }
    //    //set modified dataTransfer object to the file input back
    //    document.getElementById('UploadPictures').files = dataTransfer.files;
    //});
});

function removeUploadedPicture(imageName, eve) {
    $(eve).closest('div.col-3').remove();
    //$(eve).closest('div.img').remove();
    for (let i = 0; i < dataTransferUnitUploadPictures.items.length; i++) {
        //remove matching one from dataTransferUnitUploadPictures object
        if (imageName === dataTransferUnitUploadPictures.items[i].getAsFile().name) {
            dataTransferUnitUploadPictures.items.remove(i);
            continue;
        }
    }
    for (let i = 0; i < dataTransferUnitUploadPicturesSlider.items.length; i++) {
        //remove matching one from dataTransferUnitUploadPicturesSlider object
        if (imageName === dataTransferUnitUploadPicturesSlider[i].name) {
            dataTransferUnitUploadPicturesSlider.splice(i,1)
            continue;
        }
    }
    //set modified dataTransferUnitUploadPictures object to the file input back
    document.getElementById('UploadPictures').files = dataTransferUnitUploadPictures.files;
}
$("#CoverPictures").on('change', function (e) {
    //When files are selected this change event is triggered in this we
    // show items on front end
    for (var i = 0; i < this.files.length; i++) {
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
                                                                                 <a href="#" onclick="removeCoverPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                     </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#UnitCoverPictureGalleryContainer").append(imageContainer);
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
                                                                                 <a href="#" onclick="removeCoverPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                     </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#UnitCoverPictureGalleryContainer").append(imageContainer);
        }
        else {
            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display: flex;">
                                                                    <img src="` + URL.createObjectURL(this.files.item(i)) + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                      <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date">4/27/2023</div>
                                                                            <div class="description">image</div>
                                                                            <div class="func">
                                                                             <a class="image-zoom" onclick="viewImage(\`` + URL.createObjectURL(this.files.item(i)) + `\`,` + i +`,value='coverPhoto', this)">                                                                              
                                                                                    <i class="icon s7-search"></i>
                                                                                 </a>
                                                                                    <a href="#" onclick="removeCoverPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                         </div>
                                                                    </div>
                                                                       </div>
                                                                 </div>
                                                              </div>
                                                            </div>
                                                         </div>`
            $("#UnitCoverPictureGalleryContainer").append(imageContainer);
        }
        dataTransferUnitCoverPicturesSlider.push({ path: URL.createObjectURL(this.files.item(i)), name: this.files.item(i).name });
    };

    //add all files to the dataTransferUnitCoverPictures object one by one will be using it later
    for (let file of this.files) {
        dataTransferUnitCoverPictures.items.add(file);
    }
    //set dataTransfer object to the files array
    this.files = dataTransferUnitCoverPictures.files;


    //$('span.file-delete').click(function () {
    //    let name = $(this).next('span.name').text();

    //    $(this).parent().remove();
    //    for (let i = 0; i < dataTransfer.items.length; i++) {
    //        //remove matching one from dataTransfer object
    //        if (name === dataTransfer.items[i].getAsFile().name) {
    //            dataTransfer.items.remove(i);
    //            continue;
    //        }
    //    }
    //    //set modified dataTransfer object to the file input back
    //    document.getElementById('CoverPictures').files = dataTransfer.files;
    //});
});

function removeCoverPicture(imageName, eve) {
    $(eve).closest('div.col-3').remove();
    //$(eve).closest('div.img').remove();
    for (let i = 0; i < dataTransferUnitCoverPictures.items.length; i++) {
        //remove matching one from dataTransferUnitCoverPictures object
        if (imageName === dataTransferUnitCoverPictures.items[i].getAsFile().name) {
            dataTransferUnitCoverPictures.items.remove(i);
            continue;
        }
    }

    for (let i = 0; i < dataTransferUnitCoverPicturesSlider.length; i++) {
        //remove matching one from dataTransferUnitCoverPicturesSlider object
        if (imageName === dataTransferUnitCoverPicturesSlider[i].name) {
            dataTransferUnitCoverPicturesSlider.splice(i, 1);
            continue;
        }
    }
    //set modified dataTransfer object to the file input back
    document.getElementById('UploadPictures').files = dataTransfer.files;
}

$("#VideoURL").on('change', function (e) {
    //When files are selected this change event is triggered in this we
    // show items on front end    
    var fileSizeInMBs = 0;
    for (var i = 0; i < this.files.length; i++) {
        fileSizeInMBs = Math.floor(this.files[i].size / 1000000);
        if (fileSizeInMBs >= 4) {
            swal.fire("", 'File is exceeded than 4MB', 'warning');
            return;
        }
    }
    
    for (var i = 0; i < this.files.length; i++) {        
        //let fileBlock = $('<span/>', { class: 'file-block' }),
        //    fileName = $('<span/>', { class: 'name', text: this.files.item(i).name });
        //fileBlock.append('<span class="file-delete"><span>+</span></span>')
        //    .append(fileName).append(`<a href="#" onclick="viewUploadedPicture( \`` + URL.createObjectURL(this.files.item(i)) + `\`)" style="position:absolute;right:12;">View </a>`);
        //$("#unitVideosFilesList > #unitVideosFileName").append(fileBlock);
        var fileExtension = this.files.item(i).name.split('.').pop();

        var videoContainer = `<div class="col-3 pl-0 pr-0">
                        <div class="item" style="width:100%">
                            <div class="photo">
                            <div class="img" style="height: 13rem;display: flex;">
                             <input type="hidden" class="VideoURLID" value="`+ 0 + `" />
                            <a href="#" onclick="removeUnitVideoUrl(\`` + this.files.item(i).name + `\`, this)" class="file-delete" style="float: right;
    right: -15px;
    position: absolute;
    z-index: 1;
    top: -2px;
    rotate: 54deg;"><i class="icon s7-close" style="font-size: 1.5vw;color: #db4437;"></i></a>
                                <div class="img" style="height: 13rem;display:flex;">
                                    <video controls style="width:100%;">
                                        <source src="` + URL.createObjectURL(this.files.item(i)) + `" type="video/` + fileExtension +`" />
                                        Your browser does not support the video tag
                                    </video>                                   
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>`        
        $("#UnitVideoGalleryContainer").append(videoContainer);
    };

    //add all files to the dataTransferUnitVideos object one by one will be using it later
    for (let file of this.files) {        
        dataTransferUnitVideos.items.add(file);
    }
    //set dataTransfer object to the files array
    this.files = dataTransferUnitVideos.files;

});


var getUnitUploadPictureByIdCallBack = function (responseJSON) {
    var item = responseJSON.resultJSON;
    $.each(item, function (rowIndex, rowItem) {
        var fileExtension = rowItem.OrignalName.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = ` <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
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
                                                                                 <a href="#" onclick="removeUnitUploadedPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> `
            $("#UnitPictureGalleryContainer").append(imageContainer);
        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
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
                                                                                 <a href="#" onclick="removeUnitUploadedPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                         </div>
                                                      </div>`
            $("#UnitPictureGalleryContainer").append(imageContainer);

        }


        else {
            //var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
            //                                                <div class="photo">
            //                                                    <div class="img" style="height: 13rem;display: flex;">
            //                                                     <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
            //                                                        <img src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" alt="Gallery Image" />
            //                                                        <div class="over">
            //                                                            <div class="info" style="display:block;">
            //                                                                <div class="date"></div>
            //                                                                <div class="description">
            //                                                                ` + rowItem.OrignalName + `
            //                                                                </div>
            //                                                                <div class="func">
            //                                                                    <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
            //                                                                       <i class="icon s7-search"></i>
            //                                                                    </a>
            //                                                                     <a href="#" onclick="removeUnitUploadedPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
            //                                                                </div>
            //                                                            </div>
            //                                                        </div>
            //                                                    </div>
            //                                                </div>
            //                                                </div>
            //                                            </div>`

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display: flex;">
                                                                <input type="hidden" class="UnitCoverPictureID" value="`+ rowItem.ID + `" />
                                                                    <img src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                             <a class="image-zoom" onclick="viewImage(\`` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `\`,` + rowIndex +`,value='uploadPicture', this)">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitUploadedPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                       </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#UnitPictureGalleryContainer").append(imageContainer);
            
            dataTransferUnitUploadPicturesSlider.push({ path: rowItem.RelativePath + rowItem.NewName + rowItem.Extension, name: rowItem.NewName });
            
        }
    })

}
var getUnitCoverPictureByIdCallBack = function (responseJSON) {
    var item = responseJSON.resultJSON;
    $.each(item, function (rowIndex, rowItem) {
        var fileExtension = rowItem.OrignalName.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
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
                                                                                 <a href="#" onclick="removeUnitCoverPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>`
            $("#UnitCoverPictureGalleryContainer").append(imageContainer);
        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; justify-content: center;">
                                                                 <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
                                                                    <img src="@Url.Content("~/Content/images/docs.png")" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
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
                                                                                 <a href="#" onclick="removeUnitCoverPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>`
            $("#UnitCoverPictureGalleryContainer").append(imageContainer);

        }
        else {

            var imageContainer = `<div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display: flex;">
                                                                <input type="hidden" class="UnitCoverPictureID" value="`+ rowItem.ID + `" />
                                                                    <img src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                     <div class="info-wrapper">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                     <a class="image-zoom" onclick="viewImage(\`` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `\`,` + rowIndex +`,value='coverPhoto', this)">                                                                              
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitCoverPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                        </div>`
            $("#UnitCoverPictureGalleryContainer").append(imageContainer);
            dataTransferUnitCoverPicturesSlider.push({ path: rowItem.RelativePath + rowItem.NewName + rowItem.Extension, name: rowItem.OrignalName });
        }
        

    });

}
var getUnitVideoURLByIdCallBack = function (responseJSON) {
    var item = responseJSON.resultJSON;
    $.each(item, function (rowIndex, rowItem) {
        var fileExtension = rowItem.OrignalName.split('.').pop();
        var videoContainer = `<div class="col-3 pl-0 pr-0">
                        <div class="item" style="width:100%">
                            <div class="photo">
                            <div class="img" style="height: 13rem;display: flex;">
                             <input type="hidden" class="VideoURLID" value="`+ rowItem.ID + `" />
                            <a href="#" onclick="removeUnitVideoUrl(\`` + rowItem.OrignalName + `\`, this)" class="file-delete" style="float: right;
    right: -15px;
    position: absolute;
    z-index: 1;
    top: -2px;
    rotate: 54deg;"><i class="icon s7-close" style="font-size: 1.5vw;color: #db4437;"></i></a>
                                <div class="img" style="height: 13rem;display:flex;">
                                    <video controls style="width:100%;">
                                        <source src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" type="video/` + fileExtension +`" />
                                        Your browser does not support the video tag
                                    </video>                                   
                                </div>
                                 </div>
                            </div>
                        </div>
                    </div>`        
        $("#UnitVideoGalleryContainer").append(videoContainer);
    });
}

function removeUnitUploadedPicture(imageName, eve) {

    if ($(eve).closest('div.img').find('input.UnitUploadPictureID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.UnitUploadPictureID').val());
    }
    else {
        for (let i = 0; i < dataTransferUnitUploadPictures.items.length; i++) {
            //remove matching one from dataTransferUnitUploadPictures object
            if (imageName === dataTransferUnitUploadPictures.items[i].getAsFile().name) {
                dataTransferUnitUploadPictures.items.remove(i);
                continue;
            }
        }
      
        //set modified dataTransferUnitUploadPictures object to the file input back
        document.getElementById('UploadPictures').files = dataTransferUnitUploadPictures.files;
    }
    for (let i = 0; i < dataTransferUnitUploadPicturesSlider.items.length; i++) {
        //remove matching one from dataTransferUnitUploadPicturesSlider object
        if (imageName === dataTransferUnitUploadPicturesSlider[i].name) {
            dataTransferUnitUploadPicturesSlider.splice(i, 1);
            continue;
        }
    }
    //$(eve).closest('div.img').remove();   
    $(eve).closest('div.col-3').remove();
}
function removeUnitCoverPicture(imageName, eve) {

    if ($(eve).closest('div.img').find('input.UnitCoverPictureID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.UnitCoverPictureID').val());

    }
    else {
        for (let i = 0; i < dataTransferUnitCoverPictures.items.length; i++) {
            //remove matching one from dataTransferUnitCoverPictures object
            if (imageName === dataTransferUnitCoverPictures.items[i].getAsFile().name) {
                dataTransferUnitCoverPictures.items.remove(i);
                continue;
            }
        }

       
        //set modified dataTransferUnitCoverPictures object to the file input back
        document.getElementById('CoverPictures').files = dataTransferUnitCoverPictures.files;
    }
    for (let i = 0; i < dataTransferUnitCoverPicturesSlider.length; i++) {
        //remove matching one from dataTransferUnitCoverPictures object
        if (imageName === dataTransferUnitCoverPicturesSlider[i].name) {
            dataTransferUnitCoverPicturesSlider.splice(i, 1);
            continue;
        }
    }
    //$(eve).closest('div.img').remove();
    $(eve).closest('div.col-3').remove();
}
function removeUnitVideoUrl(videoName, eve) {   
    if ($(eve).closest('div.img').find('input.VideoURLID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.VideoURLID').val());
    }
    else {
        for (let i = 0; i < dataTransferUnitVideos.items.length; i++) {
            //remove matching one from dataTransferUnitVideos object
            if (videoName === dataTransferUnitVideos.items[i].getAsFile().name) {
                dataTransferUnitVideos.items.remove(i);
                continue;
            }
        }
        //set modified dataTransferUnitVideos object to the file input back
        document.getElementById('UnitVideoGalleryContainer').files = dataTransferUnitVideos.files;
    }
    //$(eve).closest('div.img').remove();
    $(eve).closest('div.col-3').remove();
}

function deleteUploadedFile(id = 0) {
    ajaxRequest({ url: "/RealEstate/File/Delete", type: 'POST', data: { ID: id }, callBack: deleteUploadedFileCallBack });
}
var deleteUploadedFileCallBack = function (responseJSON) {
    if (responseJSON.IsSuccess) {
        swal.fire("", responseJSON.Message, 'success');
    }
    else {
        swal.fire("", responseJSON.Message, responseJSON.Type);

    }
}
function viewImage(imagePath, imageIndex = 0,value) {
    _viewImagebyArrayName = value; 
    $("#pictureModal").modal('show');
    $('#imageView').attr('src', imagePath);

    _selectedImageIndex = imageIndex;
   
}
//function viewCoverImage(imagePath, imageIndex = 0, value) {
//    _viewImagebyArrayName = value;
   
//    $("#pictureModal").modal('show');
//    $('#imageView').attr('src', imagePath);

//    _selectedImageIndex = imageIndex;

//}

function nextImageView() {    
    if (_viewImagebyArrayName == 'uploadPicture') {
   
        _selectedImageIndex++; //Increment the index by 1
        if (_selectedImageIndex == dataTransferUnitUploadPicturesSlider.length) {


            _selectedImageIndex = 0;

        }
        var imagePath = dataTransferUnitUploadPicturesSlider[_selectedImageIndex].path; //URL.createObjectURL(dataTransferUnitUploadPicturesSlider.files[_selectedImageIndex]);    
        $('#imageView').attr('src', imagePath);
        
        //$('#imageView').animate({ transition: '1s ease-in-out' }, 'slow', 500, function () {
        //    console.log("first step complete");

        //});
       
    }
   
    else if (_viewImagebyArrayName == 'coverPhoto') {
        _selectedImageIndex++; //Increment the index by 1
        if (_selectedImageIndex == dataTransferUnitCoverPicturesSlider.length) {

            _selectedImageIndex = 0;
        }
        var imagePath = dataTransferUnitCoverPicturesSlider[_selectedImageIndex].path;//URL.createObjectURL(dataTransferUnitCoverPictures.files[_selectedImageIndex]);

        $('#imageView').attr('src', imagePath);
        //$('#imageView').animate({ transition: '1s ease-in-out' }, 'slow', 500, function () {
        //    console.log("first step complete");

        //});
    }
    

   
  
    
    
    
    
    
    

    
    
    
    

}

function previousImageView() {
    if (_viewImagebyArrayName == 'uploadPicture') {
      
         _selectedImageIndex--; //Increment the index by 1
        if (_selectedImageIndex < 0) {

            _selectedImageIndex = dataTransferUnitUploadPicturesSlider.length - 1;
        }      
        var imagePath = dataTransferUnitUploadPicturesSlider[_selectedImageIndex].path;// URL.createObjectURL(dataTransferUnitUploadPicturesSlider.files[_selectedImageIndex]);
        $('#imageView').attr('src', imagePath);

        //$('#imageView').animate({ transition: '1s ease-in-out' }, 'slow', 500, function () {
        //    console.log("first step complete");

        //});

    }

    else if (_viewImagebyArrayName == 'coverPhoto') {
               
        _selectedImageIndex--; //Increment the index by 1

        if (_selectedImageIndex < 0) {
            _selectedImageIndex = dataTransferUnitCoverPicturesSlider.length - 1;            
        }
        
        var imagePath = dataTransferUnitCoverPicturesSlider[_selectedImageIndex].path;//URL.createObjectURL(dataTransferUnitCoverPictures.files[_selectedImageIndex]);

        $('#imageView').attr('src', imagePath);
        //$('#imageView').animate({ transition: '1s ease-in-out' }, 'slow', 500, function () {
        //    console.log("first step complete");

        //});
    } 


}
*/