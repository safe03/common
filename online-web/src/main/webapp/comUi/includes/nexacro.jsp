<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

    <!-- FRAMEWORK_LIBRARY : framework lodaing path (list of scripts files in the Framework.json file) -->
    <script src="./nexacrolib/framework/SystemBase.js"></script>
    <script src="./nexacrolib/framework/SystemBase_HTML5.js"></script>
    <script src="./nexacrolib/framework/SystemBase_Runtime.js"></script>
    <script src="./nexacrolib/framework/BasicObjs.js"></script>
    <script src="./nexacrolib/framework/ErrorDefine.js"></script>
    <script src="./nexacrolib/framework/Platform_HTML5.js"></script>
    <script src="./nexacrolib/framework/Platform_Runtime.js"></script>
    <script src="./nexacrolib/framework/Platform.js"></script>
    <script src="./nexacrolib/framework/CssObjs.js"></script>
    <script src="./nexacrolib/framework/Device.js"></script>
    <script src="./nexacrolib/framework/Device_Android.js"></script>
    <script src="./nexacrolib/framework/Device_Windows.js"></script>
    <script src="./nexacrolib/framework/Device_iOS.js"></script>
	
	<!-- COMPONENTS_LIBRARY : commonent lodaing path (list of script file in json file specified in the TypeDefinition module) -->
    <script src="./nexacrolib/component/CompBase/Element_HTML5.js"></script>
    <script src="./nexacrolib/component/CompBase/Element_Runtime.js"></script>
    <script src="./nexacrolib/component/CompBase/CompBase.js"></script>
    <script src="./nexacrolib/component/CompBase/CompEventBase.js"></script>
    <script src="./nexacrolib/component/CompBase/Data.js"></script>
    <script src="./nexacrolib/component/CompBase/EditBase.js"></script>
    <script src="./nexacrolib/component/CompBase/FormBase.js"></script>
    <script src="./nexacrolib/component/CompBase/TitleBar.js"></script>
    <script src="./nexacrolib/component/CompBase/StatusBar.js"></script>
    <script src="./nexacrolib/component/CompBase/FrameBase.js"></script>
    <script src="./nexacrolib/component/CompBase/ScrollBar.js"></script>
    <script src="./nexacrolib/component/CompBase/Step.js"></script>
    <script src="./nexacrolib/component/CompBase/Animation.js"></script>
    <script src="./nexacrolib/component/ComComp/Dataset.js"></script>
    <script src="./nexacrolib/component/ComComp/DataObject.js"></script>
    <script src="./nexacrolib/component/ComComp/DomObject.js"></script>
    <script src="./nexacrolib/component/ComComp/Static.js"></script>
    <script src="./nexacrolib/component/ComComp/Button.js"></script>
    <script src="./nexacrolib/component/ComComp/Edit.js"></script>
    <script src="./nexacrolib/component/ComComp/MaskEdit.js"></script>
    <script src="./nexacrolib/component/ComComp/TextArea.js"></script>
    <script src="./nexacrolib/component/ComComp/lang/ko/ime.js"></script>
    <script src="./nexacrolib/component/ComComp/lang/ja/ime.js"></script>
    <script src="./nexacrolib/component/ComComp/ImageViewer.js"></script>
    <script src="./nexacrolib/component/ComComp/CheckBox.js"></script>
    <script src="./nexacrolib/component/ComComp/Radio.js"></script>
    <script src="./nexacrolib/component/ComComp/ListBox.js"></script>
    <script src="./nexacrolib/component/ComComp/Combo.js"></script>
    <script src="./nexacrolib/component/ComComp/Div.js"></script>
    <script src="./nexacrolib/component/ComComp/ProgressBar.js"></script>
    <script src="./nexacrolib/component/ComComp/PopupDiv.js"></script>
    <script src="./nexacrolib/component/ComComp/Menu.js"></script>
    <script src="./nexacrolib/component/ComComp/PopupMenu.js"></script>
    <script src="./nexacrolib/component/ComComp/Spin.js"></script>
    <script src="./nexacrolib/component/ComComp/DatePicker.js"></script>
    <script src="./nexacrolib/component/ComComp/Calendar.js"></script>
    <script src="./nexacrolib/component/ComComp/GroupBox.js"></script>
    <script src="./nexacrolib/component/ComComp/Tab.js"></script>
    <script src="./nexacrolib/component/ComComp/FileDialog.js"></script>
    <script src="./nexacrolib/component/ComComp/FileDownload.js"></script>
    <script src="./nexacrolib/component/ComComp/FileDownTransfer.js"></script>
    <script src="./nexacrolib/component/ComComp/FileUpload.js"></script>
    <script src="./nexacrolib/component/ComComp/FileUpTransfer.js"></script>
    <script src="./nexacrolib/component/ComComp/VideoPlayer.js"></script>
    <script src="./nexacrolib/component/ComComp/WebBrowser.js"></script>
    <script src="./nexacrolib/component/ComComp/GoogleMap.js"></script>
    <script src="./nexacrolib/component/ComComp/Sketch.js"></script>
    <script src="./nexacrolib/component/ComComp/ExportObject.js"></script>
    <script src="./nexacrolib/component/ComComp/ImportObject.js"></script>
    <script src="./nexacrolib/component/ComComp/Tray.js"></script>
    <script src="./nexacrolib/component/ComComp/Plugin.js"></script>
    <script src="./nexacrolib/component/ComComp/VirtualFile.js"></script>
    <script src="./nexacrolib/component/ComComp/Cell.js"></script>
    <script src="./nexacrolib/component/ComComp/View.js"></script>
    <script src="./nexacrolib/component/ComComp/Action.js"></script>
    <script src="./nexacrolib/component/ComComp/WebView.js"></script>
    <script src="./nexacrolib/component/Grid/GridInfo.js"></script>
    <script src="./nexacrolib/component/Grid/Grid.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/SQLite.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/SQLite_Runtime.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/DeviceObjs.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/DeviceObjs_Runtime.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/Mobile.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/BluetoothLE.js"></script>
    <script src="./nexacrolib/component/DeviceAPI/TCPClientSocket.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Namespace.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Eco.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/array.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/date.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/number.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/string.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/object.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Style.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Logger.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Color.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/XComp.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/PositionSize.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Json.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Event.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/LocalStorage.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/Factory.js"></script>
    <script src="./nexacrolib/component/EcoLibrary/util.js"></script>
    <script src="./nexacrolib/component/Splitter/Splitter.js"></script>
    <script src="./nexacrolib/component/CompBaseEx/SimpleComp.js"></script>
    <script src="./nexacrolib/component/CompBaseEx/ComplexComp.js"></script>
    <script src="./nexacrolib/component/ListView/ListView.js"></script>
    <script src="./nexacrolib/component/Chart/GraphicsChart.js"></script>
    <script src="./nexacrolib/component/Chart/ChartBase.js"></script>
    <script src="./nexacrolib/component/Chart/BasicChart.js"></script>
    <script src="./nexacrolib/component/Chart/BubbleChart.js"></script>
    <script src="./nexacrolib/component/Chart/PieChart.js"></script>
    <script src="./nexacrolib/component/Chart/GaugeChart.js"></script>
    <script src="./nexacrolib/component/Chart/RadarChart.js"></script>
    <script src="./nexacrolib/component/Chart/RoseChart.js"></script>
    <script src="./nexacrolib/component/Chart/FloatChart.js"></script>
    <script src="./nexacrolib/component/Chart/PyramidChart.js"></script>
    <script src="./nexacrolib/component/Graphics/Graphics.js"></script>
    <script src="./nexacrolib/component/monthCalendar/monthCalendar.xcdl.js"></script>
    <script src="./nexacrolib/component/fromtoCalendar/fromtoCalendar.xcdl.js"></script>
    <script src="./nexacrolib/component/UbiReport4/UbiReport4.js"></script>
    <script src="./nexacrolib/component/UbiReport4/ubihtml.js"></script>
    <script src="./nexacrolib/component/UbiReport4/ubiexcanvas.js"></script>
    <script src="./nexacrolib/component/UbiReport4/ubinonax.js"></script>
    <script src="./nexacrolib/component/UbiReport4/msg.js"></script>
    <script src="./nexacrolib/component/MultiCombo/MultiCombo.xcdl.js"></script>
    <script src="./nexacrolib/component/Pagination/Pagination.xcdl.js"></script>
    <script src="./nexacrolib/component/pivot/NxPivot.js"></script>
    <script src="./nexacrolib/component/pivot/NxPivot.message.js"></script>
    <script src="./nexacrolib/component/pivot/NxPivot.pivot.js"></script>
    <script src="./nexacrolib/component/pivot/NxPivot.config.js"></script>
    <script src="./nexacrolib/component/pivot/NxPivot.view.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_array.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_color.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_component.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_date.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_event.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_factory.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_json.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_logger.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_number.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_position.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_storage.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_string.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_style.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_util.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_verification.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw_popup.js"></script>
    <script src="./nexacrolib/component/sfw/lib/sfw.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Project.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Library.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Repositories.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Batch.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/DatasetManager.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/TransactionManager.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Services.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Socket.js"></script>
    <script src="./nexacrolib/component/sfw/lib/core/Router.js"></script>
    <script src="./nexacrolib/component/sfw/lib/util/UtilInterface.js"></script>
    <script src="./nexacrolib/component/sfw/lib/util/impl/DatasetUtil.js"></script>
    <script src="./nexacrolib/component/sfw/lib/util/impl/GridUtil.js"></script>
    <script src="./nexacrolib/component/sfw/lib/util/impl/ServiceUtil.js"></script>
    <script src="./nexacrolib/component/sfw/lib/util/impl/builder.js"></script>
    <script src="./nexacrolib/component/datasetUtility/datasetUtility.js"></script>
    <script src="./nexacrolib/component/Custom_Component/Custom_Component.js"></script>
	<!-- ENVIRONMENT_LIBRARY : application environment path (path of Environment.xml.js) -->
    <script src="./environment.xml.js"></script>