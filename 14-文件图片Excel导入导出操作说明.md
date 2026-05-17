# 14-文件图片Excel导入导出操作说明

> 适用对象：闪用前端读取 Excel、上传 Excel 到中台处理、从闪用页面导出数据、CSV 下载、图片预览、消息窗口自定义输入。
>
> 本篇基于在线文档中明确出现的 `XLSX`、`SystemJS.import`、文件上传 `eventArgs.file/raw`、`FileReader`、`request`、`requestWithToken`、`dataExport`、`ImagePreview` 等内容整理。

---

## 1. 能力速查

- `XLSX`
  - Sheet.js 能力，用于 Excel 读取、解析、生成。

- `SystemJS.import`
  - 动态引入 Excel 读取库或其他 JS/CSS 文件。

- `FileReader`
  - 前端读取上传文件内容。

- `eventArgs.file` / `eventArgs.fileList`
  - 文件上传组件事件里获取文件。

- `request`
  - 上传文件到中台接口。

- `requestWithToken`
  - 调用平台导出接口。

- `ImagePreview`
  - 图片放大预览。

---

## 2. 前端读取 Excel 流程

在线文档里的流程：

1. 导入 Excel 读取库。
2. 使用上传文件组件获取 Excel。
3. 在上传组件 `onChange` 钩子读取文件。
4. 用 `XLSX.read` 解析 workbook。
5. 用 `XLSX.utils.sheet_to_json` 读取 sheet 数据。
6. 校验表头。
7. 把解析结果写入变量或高级表格。

---

## 3. 导入 Excel 读取库

文档示例是在 `sysInit` 里导入附件中的 JS 文件。

```javascript
SystemJS.import('/dfs/group1/M00/00/0A/excel-reader.js')
```

如果当前环境已经内置 `XLSX`，可直接使用文档里的全局 `XLSX`。

---

## 4. 文件上传 onChange 读取 Excel

文档示例使用 `eventArgs.fileList[0]` 获取文件，并通过 `FileReader.readAsArrayBuffer(file.raw)` 读取。

```javascript
const excelTempMap = getValueByName({
  name: 'mapExcelTemp',
  type: 'var'
})

let isExcelTemp = true
let file = eventArgs.fileList[0]
let fileReader = new FileReader()

fileReader.onload = e => {
  const buffer = e.target.result
  let workbook = XLSX.read(buffer, {})

  workbook.SheetNames.forEach(sheetName => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: ''
    })

    let cols = Object.keys(rows[0])

    for (let key in excelTempMap) {
      if (!cols.includes(excelTempMap[key])) {
        isExcelTemp = false
        break
      }
    }

    if (isExcelTemp) {
      let dataExcel = { cols, rows }

      setValueByName({
        name: 'dataExcel',
        type: 'var',
        value: dataExcel
      })

      setValueByName({
        name: 'isClearUploadFile',
        type: 'var',
        value: false
      })

      jumpToPage('Success')
    } else {
      setValueByName({
        name: 'isClearUploadFile',
        type: 'var',
        value: true
      })

      MessageBox.alert('Excel 表头格式不正确，请参考模板', '错误', {
        type: 'error'
      })
    }
  })
}

fileReader.readAsArrayBuffer(file.raw)
```

注意：

- `sheet_to_json(..., { defval: '' })` 可以让空单元格保留为空字符串。
- 文档实践里只取了第一类需要的数据，实际可按项目处理多 sheet。
- 表头映射建议放变量里，后续调整字段更方便。

---

## 5. 清空错误上传文件

文档示例通过布尔变量判断是否清空上传文件。

```javascript
let clear = getValueByName({
  name: 'isClearUploadFile',
  type: 'var'
})

if (clear) {
  setValueByName({
    name: 'crFileUploader_importTemplate',
    type: 'elem',
    attr: 'attrs.attrs.fileList',
    value: []
  })

  setValueByName({
    name: 'isClearUploadFile',
    type: 'var',
    value: false
  })
}
```

---

## 6. Excel 数据填充高级表格

把解析出的 `cols`、`rows` 写入高级表格：

```javascript
function main() {
  let dataExcel = getValueByName({
    name: 'dataExcel',
    type: 'var'
  })

  if (Object.keys(dataExcel).length === 0) {
    return
  }

  let { cols, rows } = dataExcel
  let schemaList = []

  for (let item in cols) {
    let field = {}
    field.label = cols[item]
    field.prop = cols[item]
    field.align = 'center'
    field.minWidth = 150
    schemaList.push(field)
  }

  setValueByName({
    name: 'crCusTable_sheet',
    type: 'elem',
    attr: 'attrs.attrs.cols',
    value: schemaList
  })

  setValueByName({
    name: 'crCusTable_sheet',
    type: 'elem',
    attr: 'attrs.attrs.data',
    value: rows
  })
}

main()
```

---

## 7. Excel 数据导入表单

文档示例使用映射表 `mapExcelTemp` 将 Excel 表头映射到目标表单字段。

```javascript
const excelTempMap = getValueByName({
  name: 'mapExcelTemp',
  type: 'var'
})

const productModel = getModel('product')
showLoading('导入中...')

let data = getValueByName({
  name: 'dataExcel',
  type: 'var'
})

try {
  for (let item of data) {
    let setData = {}

    for (let key in excelTempMap) {
      setData[productModel[key]] = item[excelTempMap[key]]
    }

    await createTableData(productModel.modelId, setData)
  }
} catch (err) {
  clearLoading()
  MessageBox.alert(`导入失败：${err}`, '错误', { type: 'error' })
  return
}

clearLoading()

setValueByName({ name: 'dataExcel', type: 'var', value: [] })
setValueByName({
  name: 'crFileUploader_importTemplate',
  type: 'elem',
  attr: 'attrs.attrs.fileList',
  value: []
})
```

---

## 8. 上传 Excel 到中台处理

在线文档里还有一种方式：上传组件触发后，把 Excel 文件通过 `FormData` 上传到中台接口。

```javascript
async function main() {
  console.log(eventArgs)

  const formData = new FormData()
  formData.append('excel', eventArgs.file.raw)

  let config = {
    url: '/app/crdata/uploadExcel1/',
    method: 'POST',
    headers: {
      'content-type': 'multipart/form-data'
    },
    data: formData
  }

  let resp = await request(config)

  if ((resp.code + '')[0] !== '2') {
    window.open(window.location.origin + resp.data)
  } else {
    MessageBox.alert(`export failed:${resp?.msg}`, 'Error', {
      type: 'error'
    })
  }
}

main()
```

注意：

- 文件对象来自 `eventArgs.file.raw`。
- 文档里中台接口路径为 `/app/crdata/uploadExcel1/`。
- 返回结构要按实际中台插件确认。

---

## 9. 中台读取并导出 Excel

文档中台示例使用 Node 侧 `xlsx` 包。

```javascript
const XLSX = require('xlsx')
const dayjs = global.get('crdayjs')

async function main() {
  let buffer = msg.req.files[0].buffer
  let workbook = XLSX.read(buffer, {})

  workbook.SheetNames.forEach(sheetName => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: ''
    })
    let cols = Object.keys(rows[0])
    node.error(['cols', cols])
    node.error(['rows', rows])
  })

  let excelName = 'write'
  let formatName = `${excelName}${dayjs().format('YYYYMMDDHHmmssSSS')}.xlsx`
  let filename = `/var/project/crnocode/media/download/${formatName}`

  XLSX.writeFile(workbook, filename)

  return `/media/download/${formatName}`
}

msg.payload = await main()
return msg
```

---

## 10. 闪用页面调用导出接口

文档说明：可在闪用调用 `/app/api/{app}/{model}/dataExport` API 导出数据。

关键参数：

- `format: 'xlsx'`
- `objects`：导出的数据 id 数组。
- `template_url`：模板文件路径，可选。
- `use_templates`：是否使用模板。
- `options.export_fields`：选择字段导出。

整理后的模板：

```javascript
const projectModel = getModel('project')
const fileModel = getModel('templateFile')
const appId = 'ncapp_demo'
const templateCode = 'tenderMgmt'

async function main() {
  showLoading('导出中...')

  let selectedRows = getValueByName({
    name: 'crCusTable_table_project',
    type: 'elem',
    attr: 'attrs.attrs.selectedRows'
  }) || []

  let objects = selectedRows.map(item => item.id)

  try {
    let url = `${window.location.origin}/app/api/${appId}/${projectModel.modelId}/dataExport/?`

    const pathRes = await invokeModelApi(
      fileModel.modelId,
      'getList',
      0,
      0,
      `?${fileModel.codename}=${templateCode}`
    )

    if (pathRes.length === 0) {
      throw Error('未找到导出模板')
    }

    let templateUrl = pathRes[0][`${fileModel.file}_path`][0]

    const res = await requestWithToken({
      url: url.slice(0, url.length - 1),
      method: 'post',
      data: {
        format: 'xlsx',
        objects,
        template_url: templateUrl,
        use_templates: true
      }
    })

    clearLoading()

    if (res?.data?.code === 200) {
      window.open(window.location.origin + res.data.data)
      return
    }

    MessageBox.alert(`导出失败：${res?.data?.msg}`, '错误', { type: 'error' })
  } catch (err) {
    clearLoading()
    MessageBox.alert(`导出失败：${err}`, '错误', { type: 'error' })
  }
}

main()
```

---

## 11. 前端生成 CSV 并下载

文档里 `XLSX` 示例将 JSON 转 sheet，再转 CSV 下载。

```javascript
let data = getValueByName({
  name: 'VAR_pointElectricityDataList',
  type: 'var'
})

data = data.map(item => {
  return {
    date: dayjs(item[energyModel.dateAndTime]).format('YYYY-MM-DD HH:mm:ss'),
    value: item[`${energyModel.usedValue}_sum`].toFixed(2)
  }
})

var ws = XLSX.utils.json_to_sheet(data)
var csv = XLSX.utils.sheet_to_csv(ws)
var csvString = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csv)

let link = document.createElement('a')
link.href = csvString
link.download = 'iot.csv'
document.body.appendChild(link)
link.click()
document.body.removeChild(link)
```

---

## 12. 图片预览

文档说明：`ImagePreview` 支持图片放大预览。

```javascript
ImagePreview(['https://unpkg.com/@vant/assets/apple-1.jpeg'])
```

多图预览：

```javascript
function main() {
  ImagePreview([
    'https://example.com/image-1.png',
    'https://example.com/image-2.png'
  ])
}

main()
```

---

## 13. 消息窗口自定义输入

文档说明：可以使用 `MessageBox` 的自定义 HTML 功能。

```javascript
function dialogPopup() {
  let htmlString = `
    <div>
      <span>请选择打印机：</span>
      <select id="choosePrintDevice"></select>
    </div>
    <div>
      <span>每个标签打印份数：</span>
      <input type="number" id="copyNum">
    </div>
  `

  MessageBox.alert(htmlString, '提示', {
    dangerouslyUseHTMLString: true
  }).then(() => {
    let copyNum = document.getElementById('copyNum').value
    console.log('打印份数：', copyNum)
  })

  setTimeout(() => {
    let htmlSelect = document.getElementById('choosePrintDevice')
    if (!htmlSelect) {
      return
    }

    let option = document.createElement('option')
    option.text = '默认打印机'
    option.value = 'default'
    htmlSelect.add(option)
  }, 200)
}

dialogPopup()
```

注意：

- 文档示例里说明 MessageBox 可能没有加载完成，所以使用定时器获取 HTML 元素。
- 自定义 HTML 不要渲染不可信内容。

---

## 14. 常见坑

- Excel 表头不一致：用映射变量校验表头，失败时清空上传文件。
- 读取空单元格丢字段：`sheet_to_json` 使用 `{ defval: '' }`。
- 上传文件对象取错：文档示例里前端上传使用 `eventArgs.file.raw` 或 `eventArgs.fileList[0].raw`。
- 导出后没有下载：导出接口成功后使用 `window.open(window.location.origin + res.data.data)`。
- 模板导出找不到模板：先用 `invokeModelApi` 查询模板文件表。
- `showLoading` 后异常没有关闭：`catch` 里也要 `clearLoading()`。

---

## 15. 原始资料入口

- [闪用插件](https://doc.cloudred.cn/web/#/9/96)
- [闪用读取 excel 数据](https://doc.cloudred.cn/web/#/9/223)
- [如何闪用页面中导出数据](https://doc.cloudred.cn/web/#/9/247)
- [对 excel 进行导入导出](https://doc.cloudred.cn/web/#/9/289)
- [如何在消息窗口中获取用户输入](https://doc.cloudred.cn/web/#/9/239)

