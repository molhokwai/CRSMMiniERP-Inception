
function openCreateShiftForm() {
  // const formId = '1Hcbh07N7P-QolKe2JxRvvZFVb-tMlfVQexv_JQXc5ks';
  const formEmbedHTML = '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLScMG0Plz_rujM09LR6UUCPVoqvc1dquvNeMMu9PaVsT_QByOA/viewform?embedded=true" width="640" height="775" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>';

  var htmlOutput = HtmlService
    .createHtmlOutput(formEmbedHTML)
    .setWidth(750)
    .setHeight(2000);

  // Open the form in a new browser tab
  // FormApp.getUi().
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, ':form:');
}
