function fixGmailConversationLabels() {
    const debugMode = true;
    const messageLimit = 5;

    // creates the labels if they don't exist.
    if(!GmailApp.getUserLabelByName("X-NO-LABEL")){
        GmailApp.createLabel("X-NO-LABEL");
    }
    if(!GmailApp.getUserLabelByName("X-LABEL-CONFLICT")){
        GmailApp.createLabel("X-LABEL-CONFLICT");
    }

    var threads = GmailApp.search('has:nouserlabels -in:inbox -in:draft -label:X-NO-LABEL -label:X-LABEL-CONFLICT',0, messageLimit);
    for (var i = 0; i < threads.length; i++) {
        var thread = threads[i];
        var labels = thread.getLabels();
        var labelToApply = '';
        if (labels.length === 0) {
            labelToApply = 'X-NO-LABEL';
        } else if (labels.length === 1) {
            labelToApply = labels[0].getName();
        } else {
            labelToApply = 'X-LABEL-CONFLICT';
        }
        if (labelToApply) {
            Logger.log("Thread: " + thread.getFirstMessageSubject() + "\nLabel: " + labelToApply + "\nMessage count: " + thread.getMessageCount() + "\nDebug mode: " + debugMode);
            if (!debugMode) {
                thread.addLabel(GmailApp.getUserLabelByName(labelToApply)); //рандомная правка для гита №2
            }
        }
    }
}