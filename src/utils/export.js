//导出csv文件
export const handleExportFile = (content, fileName) => {
  const blob = new Blob([content]);
  if ("download" in document.createElement("a")) {
    // 非IE下载
    const elink = document.createElement("a");
    elink.download = fileName;
    elink.style.display = "none";
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
};

// 普通下载
export const handleDownload = (href, fileName) => {
  const elink = document.createElement("a");
  elink.download = fileName;
  elink.href = href;
  elink.click();
  elink.remove();
};
