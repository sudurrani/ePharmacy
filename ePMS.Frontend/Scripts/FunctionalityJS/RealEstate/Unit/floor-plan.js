/*
var floorPlanPicturesCallBack = function (responseJSON, options) {
    uploadFiles({ inputID: 'FloorPlanVideos', entity: 'UnitFloorPlanVideos', fKey: $('#UnitID').val(), callBack: floorPlanVideosCallBack, isCloseAndSaveAsDraft: options.isCloseAndSaveAsDraft });
}
var floorPlanVideosCallBack = function (responseJSON,options) {
    uploadFiles({ inputID: 'VideoURL', entity: 'UnitVideo', fKey: $('#UnitID').val(), callBack: videoURLCallBack, isCloseAndSaveAsDraft: options.isCloseAndSaveAsDraft });
}
$("#FloorPlanPictures").on('change', function (e) {
    //When files are selected this change event is triggered in this we
    // show items on front end
    for (var i = 0; i < this.files.length; i++) {
        var fileExtension = this.files.item(i).name.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = ` <div class="col-3 pl-0 pr-0"><div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="display: flex;">
                                                                 <img src="/Content/images/pdf.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                        <div class="func">
                                                                                <a class="image-zoom" href="` + URL.createObjectURL(this.files.item(i)) + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitFloorPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div></div>`
            $("#UnitFloorPlanGalleryContainer").append(imageContainer);
        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `  <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="display: flex;">
                                                                 <img src="/Content/images/docs.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + this.files.item(i).name + `
                                                                            </div>
                                                                 <div class="func">
                                                                                <a class="image-zoom" href="` + URL.createObjectURL(this.files.item(i)) + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitFloorPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div></div>`
            $("#UnitFloorPlanGalleryContainer").append(imageContainer);
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
                                                                               <a class="image-zoom" onclick="viewFloorImage(\`` + URL.createObjectURL(this.files.item(i)) + `\`, this)">
                                                                                    <i class="icon s7-search"></i>
                                                                                 </a>
                                                                                    <a href="#" onclick="removeUnitFloorPicture(\`` + this.files.item(i).name + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                     </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> </div>`

            $("#UnitFloorPlanGalleryContainer").append(imageContainer);
            dataTransferUnitFloorPictureSlider.push({ path: URL.createObjectURL(this.files.item(i)), name: this.files.item(i).name });
        }
        
    };

    //add all files to the dataTransferUnitFloorVideo object one by one will be using it later
    for (let file of this.files) {
        dataTransferUnitFloorPicture.items.add(file);
    }
    //set dataTransfer object to the files array
    this.files = dataTransferUnitFloorPicture.files;

});
// If remove in add is not working then uncomment this code and update below comment name for update
//function removeUnitFloorPicture(videoName, eve) {
//
//    $(eve).closest('div.img').remove();
//    for (let i = 0; i < dataTransferUnitFloorPicture.items.length; i++) {
//        //remove matching one from dataTransferUnitCoverPictures object
//        if (videoName === dataTransferUnitFloorPicture.items[i].getAsFile().name) {
//            dataTransferUnitFloorPicture.items.remove(i);
//            continue;
//        }
//    }
//    //set modified dataTransfer object to the file input back
//    document.getElementById('UploadPictures').files = dataTransfer.files;
//}
//
function removeUnitFloorPicture(imageName, eve) {

    if ($(eve).closest('div.img').find('input.UnitFloorPictureID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.UnitFloorPictureID').val());       
    }
    else {        
        for (let i = 0; i < dataTransferUnitFloorPicture.items.length; i++) {
            //remove matching one from dataTransferUnitCoverPictures object
            if (imageName === dataTransferUnitFloorPicture.items[i].getAsFile().name) {
                dataTransferUnitFloorPicture.items.remove(i);
                continue;
            }
        }

       
        //set modified dataTransferUnitCoverPictures object to the file input back
        document.getElementById('FloorPlanPictures').files = dataTransferUnitCoverPictures.files;
    }
    for (let i = 0; i < dataTransferUnitFloorPictureSlider.length; i++) {
        //remove matching one from dataTransferUnitCoverPictures object
        if (imageName === dataTransferUnitFloorPictureSlider[i].name) {
            dataTransferUnitFloorPictureSlider.splice(i, 1);
            continue;
        }
    }
    //$(eve).closest('div.img').remove();
    $(eve).closest('div.col-3').remove();
}

$("#FloorPlanVideos").on('change', function (e) {
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

        var fileExtension = this.files.item(i).name.split('.').pop();

        var videoContainer = `<div class="col-3 pl-0 pr-0">
                        <div class="item" style="width:100%">
                            <div class="photo">
                            <div class="img" style="height: 13rem;display: flex;">
                             <input type="hidden" class="VideoURLID" value="`+ 0 + `" />
                            <a href="#" onclick="removeFloorPlanideoUrl(\`` + this.files.item(i).name + `\`, this)" class="file-delete" style="float: right;
    right: -15px;
    position: absolute;
    z-index: 1;
    top: -2px;
    rotate: 54deg;"><i class="icon s7-close" style="font-size: 1.5vw;color: #db4437;"></i></a>
                                <div class="img" style="height: 13rem;display:flex;">
                                    <video controls style="width:100%;">
                                        <source src="` + URL.createObjectURL(this.files.item(i)) + `" type="video/` + fileExtension + `" />
                                        Your browser does not support the video tag
                                    </video>                                   
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>`        

        $("#UnitFloorVideoGalleryContainer").append(videoContainer);
    };

    //add all files to the dataTransferUnitFloorVideo object one by one will be using it later
    for (let file of this.files) {
        dataTransferUnitFloorVideo.items.add(file);        
    }
    //set dataTransfer object to the files array
    this.files = dataTransferUnitFloorVideo.files;

});
var getUnitFloorPlanVideosByIdCallBack = function (responseJSON) {
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
                                        <source src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" type="video/` + fileExtension + `" />
                                        Your browser does not support the video tag
                                    </video>                                   
                                </div>
                                 </div>
                            </div>
                        </div>
                    </div>`
        $("#UnitFloorVideoGalleryContainer").append(videoContainer);        
    });
}
function removeUnitVideoUrl(videoName, eve) {
    
    if ($(eve).closest('div.img').find('input.VideoURLID').val() > 0) {
        deleteUploadedFile($(eve).closest('div.img').find('input.VideoURLID').val());
    }
    else {
        for (let i = 0; i < dataTransferUnitFloorVideo.items.length; i++) {
            //remove matching one from dataTransferUnitCoverPictures object
            if (videoName === dataTransferUnitFloorVideo.items[i].getAsFile().name) {
                dataTransferUnitFloorVideo.items.remove(i);
                continue;
            }
        }
        //set modified dataTransferUnitCoverPictures object to the file input back
        document.getElementById('UnitFloorVideoGalleryContainer').files = dataTransferUnitCoverPictures.files;
    }
    //$(eve).closest('div.img').remove();
    $(eve).closest('div.col-3').remove();
}

var getUnitFloorPlanPicturesByIdCallBack = function (responseJSON) {
    var item = responseJSON.resultJSON;
    $.each(item, function (rowIndex, rowItem) {
        var fileExtension = rowItem.OrignalName.split('.').pop();
        if (fileExtension == 'pdf') {

            var imageContainer = `  <div class="col-3 pl-0 pr-0"> <div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex; ">
                                                                 <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
                                                                   <img src="/Content/images/pdf.png" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitFloorPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div> </div>`
            $("#UnitFloorPlanGalleryContainer").append(imageContainer);
        }
        else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'docx') {

            var imageContainer = `  <div class="col-3 pl-0 pr-0"><div class="item" style="width:100%">
                                                            <div class="photo">
                                                               <div class="img" style="display: flex;">
                                                                 <input type="hidden" class="UnitUploadPictureID" value="`+ rowItem.ID + `" />
                                                                    <img src="@Url.Content("~/Content/images/docs.png")" alt="Gallery Image" style="width: 8rem; height: 10rem;"/>
                                                                    <div class="over">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                                <a class="image-zoom" href="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" target="_blank">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitFloorPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div></div>`
            $("#UnitFloorPlanGalleryContainer").append(imageContainer);

        }
        else {
            var imageContainer = `  <div class="col-3 pl-0 pr-0"><div class="item" style="width:100%">
                                                            <div class="photo">
                                                                <div class="img" style="height: 13rem;display: flex;">
                                                                <input type="hidden" class="UnitFloorPictureID" value="`+ rowItem.ID + `" />
                                                                    <img src="` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `" alt="Gallery Image" />
                                                                    <div class="over">
                                                                        <div class="info" style="display:block;">
                                                                            <div class="date"></div>
                                                                            <div class="description">
                                                                            ` + rowItem.OrignalName + `
                                                                            </div>
                                                                            <div class="func">
                                                                               <a class="image-zoom" onclick="viewFloorImage(\`` + rowItem.RelativePath + rowItem.NewName + rowItem.Extension + `\`, this)">
                                                                                   <i class="icon s7-search"></i>
                                                                                </a>
                                                                                 <a href="#" onclick="removeUnitFloorPicture(\`` + rowItem.OrignalName + `\`, this)" class="file-delete"><i class="icon s7-close"></i></a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>`
            $("#UnitFloorPlanGalleryContainer").append(imageContainer);
            dataTransferUnitFloorPictureSlider.push({ path: rowItem.RelativePath + rowItem.NewName + rowItem.Extension, name: rowItem.OrignalName });
        }

    })
}
function viewFloorImage(picturePath, pictureIndex = 0) {
  
    $("#floorPictureModal").modal('show');
    $('#floorImageView').attr('src', picturePath);
    _selectedFloorImageIndex = pictureIndex;

}
function nextfloorImageView() {

    _selectedFloorImageIndex++; //Increment the index by 1
    if (_selectedFloorImageIndex == dataTransferUnitFloorPictureSlider.length) {


        _selectedFloorImageIndex = 0;

    }
    var picturePath = dataTransferUnitFloorPictureSlider[_selectedFloorImageIndex].path;

    $('#floorImageView').attr('src', picturePath);


    //$('#floorImageView').animate({ transition: '1s ease-in-out' }, 'slow', 500, function () {
    //    console.log("first step complete");

    //});    

}
function previousfloorImageView() {

    _selectedFloorImageIndex--; //Increment the index by 1
    if (_selectedFloorImageIndex < 0) {

        _selectedFloorImageIndex = dataTransferUnitFloorPictureSlider.length - 1;
    }  
    var picturePath = dataTransferUnitFloorPictureSlider[_selectedFloorImageIndex].path;
    $('#floorImageView').attr('src', picturePath);

    //$('#floorImageView').animate({transition: '1s ease-in-out' }, 1000, function () {
    //    console.log("first step complete");

    //});


}
*/