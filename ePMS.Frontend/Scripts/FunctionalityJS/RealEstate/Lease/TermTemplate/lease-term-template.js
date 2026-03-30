isSaveAndPreview = false, _isAutoSave = false, isAgreementSpecific = false;
var contentLength = 0;
var getAndDecryptIDCallBack = function (responseJOSN) {
    $('#ID').val(responseJOSN);

    ajaxRequest({ url: '/RealEstate/LeaseTemplate/GetById', type: 'POST', data: { ID: responseJOSN }, callBack: getLeaseTermTemplateByIdCallBack });

}
var getLeaseTermTemplateByIdCallBack = function (responseJSON) {
    $('#coverScreen').show();
    setTimeout(function () {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('AgreementID')) {
            isAgreementSpecific = true;
            $('#ID').val(0)
        }
        else {
            isAgreementSpecific = false;
            $('#ID').val(responseJSON.resultJSON.ID)
        }
        //$('#ID').val(responseJSON.resultJSON.ID),
        $('#Name').val(responseJSON.resultJSON.Name),
            CKEDITOR.instances['Header'].setData(responseJSON.resultJSON.Header),
            CKEDITOR.instances['Content'].setData(responseJSON.resultJSON.Content),
            CKEDITOR.instances['Footer'].setData(responseJSON.resultJSON.Footer)

        $('#coverScreen').hide();
    }, 2000);
}

function saveRecord(isPreview = false, isAutoSave = false, isCloseAndSaveAsDraft = false) {
    _isAutoSave = isAutoSave;
    if (customValidateForm('leaseTemplateForm')) {
        if (CKEDITOR.instances['Content'].getData() == null || CKEDITOR.instances['Content'].getData() == '') {
            infoToastr('Lease term template content is required', 'info');
        }
        else {
            var inputJSON = {
                ID: $('#ID').val(),
                Name: $('#Name').val(),
                Header: CKEDITOR.instances['Header'].getData(),
                Content: CKEDITOR.instances['Content'].getData(),
                Footer: CKEDITOR.instances['Footer'].getData(),
                IsAgreementSpecific: isAgreementSpecific
            }
            ajaxRequest({ url: '/RealEstate/LeaseTemplate/' + (isPreview == true ? 'SavePreview' : 'Save'), type: 'POST', data: inputJSON, callBack: saveRecordCallBack, isCloseAndSaveAsDraft: isCloseAndSaveAsDraft });
        }
    }
    else {
        $('#AutoSaveLabel').css('display', 'none');
    }
}
var saveRecordCallBack = function (responseJSON, options) {    
    if (!_isAutoSave) {
        if (!isSaveAndPreview) {
            successToastr(responseJSON.Message, 'success');
            $('#ID').val(responseJSON.resultJSON);
            //setTimeout(function () {
            //    window.location.href = '/RealEstate/LeaseTemplate/List?FID=yqZ5rQLsqNlebF2a30xboA==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            //}, 2000);
        }
        if (options.isCloseAndSaveAsDraft) {
            setTimeout(function () {
                window.location.href = '/RealEstate/LeaseTemplate/List?FID=yqZ5rQLsqNlebF2a30xboA==&ModuleID=/ROG3jATwE2zFwcwGcfXIg==';
            }, 2000);
        }
        if (isSaveAndPreview) {
            isSaveAndPreview = false;
            window.open('/RealEstate/LeaseTemplate/Preview?id=' + $('#ID').val(), '_blank');
        }
    }
    else {
        _isAutoSave = false;
        $('#ID').val(responseJSON.resultJSON);
        $('#AutoSaveLabel').css('display', 'none');
    }

}
// Shared dialog customization for all editors
function customizeImageDialog() {
    CKEDITOR.on('dialogDefinition', function (ev) {
        if (ev.data.name === 'image') {
            var dialogDefinition = ev.data.definition;

            // Remove 'Link' tab
            dialogDefinition.removeContents('Link');

            // Customize Upload button
            var uploadTab = dialogDefinition.getContents('Upload');
            if (uploadTab) {
                var uploadButton = uploadTab.get('uploadButton');
                if (uploadButton) {
                    uploadButton.label = 'Upload';
                    uploadButton.title = 'Upload';
                    uploadButton['className'] = 'btn-green';
                }
            }

            // Reorder tabs: Upload → Info → Advanced
            var infoTab = dialogDefinition.getContents('info');
            var advancedTab = dialogDefinition.getContents('advanced');

            dialogDefinition.removeContents('info');
            dialogDefinition.removeContents('Upload');
            dialogDefinition.removeContents('advanced');

            if (uploadTab) dialogDefinition.addContents(uploadTab);
            if (infoTab) dialogDefinition.addContents(infoTab);
            if (advancedTab) dialogDefinition.addContents(advancedTab);
        }
    });
}

// Shared CKEditor init function
function initCKEditor(id, toolbarConfig) {
    return CKEDITOR.replace(id, {
        filebrowserUploadUrl: '/RealEstate/LeaseTemplate/UploadImages',
        filebrowserBrowseUrl: '/RealEstate/LeaseTemplate/FileExplorer',
        toolbar: toolbarConfig
    });
}


