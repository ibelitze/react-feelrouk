/**
 * Internal Dependencies
 */
// Auth
import AuthSignIn from './AuthSignIn';
import AuthSignUpClient from './AuthSignUpClient';
import RecuperarPassword from './RecuperarPassword';
import ConfigurarNuevamente from './ConfigurarNuevamente';

// Start
import Dashboard from './Dashboard';

// Apps
import Mailbox from './Mailbox';
import Messenger from './Messenger';
import Calendar from './Calendar';
import ProjectManagement from './ProjectManagement';
import Task from './Task';
import FileManager from './FileManager';
import Profile from './Profile';
import Digital from './Digital';
import Human from './Human';
import Revenue from './Revenue';
import Value from './Value';

// Workspace - general - Staff
import Staff from './Staff';
import Empresas from './Empresas';
import EditarPerfilEmpresa from './EditarPerfilEmpresa';
import Usuarios from './Usuarios';
import Lineas from './LineasDeTrabajo';

// HCM - RECLUTAMIENTO
import Empleados from './Empleados';
import StepperForm from '../components/stepper-form';
import StepperFormEdicion from '../components/stepper-form-edicion';
import ListadoPerfiles from '../components/listado-perfiles';
import ListadoEmpresas from '../components/listado-empresas';
import ListadoPosiciones from '../components/listado-posiciones';
import ListadoPostulantes from '../components/listado-postulantes';

// HCM - SELECCIÓN
import TagsEnGeneral from './ListadoTags';
import VistaCargarPasos from './CargarPasos';
import VistaPasosPublicacion from './PasosPublicacion';

// Content
import Grid from './Grid';
import Colors from './Colors';
import Typography from './Typography';
import ComponentTable from './ComponentTable';

// Components Base
import ComponentAlert from './ComponentAlert';
import ComponentBadge from './ComponentBadge';
import ComponentBreadcrumbs from './ComponentBreadcrumbs';
import ComponentButton from './ComponentButton';
import ComponentCard from './ComponentCard';
import ComponentCarousel from './ComponentCarousel';
import ComponentCollapse from './ComponentCollapse';
import ComponentDropdown from './ComponentDropdown';
import ComponentListGroup from './ComponentListGroup';
import ComponentMediaObject from './ComponentMediaObject';
import ComponentModal from './ComponentModal';
import ComponentNav from './ComponentNav';
import ComponentPagination from './ComponentPagination';
import ComponentPopover from './ComponentPopover';
import ComponentProgress from './ComponentProgress';
import ComponentSpinner from './ComponentSpinner';
import ComponentTabs from './ComponentTabs';

// Components Advanced
import ComponentIconsFeather from './ComponentIconsFeather';
import ComponentIconsFontAwesome from './ComponentIconsFontAwesome';
import ComponentChartsChartJs from './ComponentChartsChartJs';
import ComponentChartsChartist from './ComponentChartsChartist';
import ComponentChartsPeity from './ComponentChartsPeity';
import ComponentChartsEcharts from './ComponentChartsEcharts';
import ComponentChartsFlot from './ComponentChartsFlot';
import ComponentTimeline from './ComponentTimeline';
import ComponentTreeView from './ComponentTreeView';
import ComponentToast from './ComponentToast';
import ComponentSweetAlert from './ComponentSweetAlert';
import ComponentMaps from './ComponentMaps';
import ComponentDataTables from './ComponentDataTables';

// Forms
import FormsBase from './FormsBase';
import FormsDateTimePicker from './FormsDateTimePicker';
import FormsValidation from './FormsValidation';
import FormsTouchSpin from './FormsTouchSpin';
import FormsRangeSlider from './FormsRangeSlider';
import FormsInputMasks from './FormsInputMasks';
import FormsDropzone from './FormsDropzone';
import FormsColorPicker from './FormsColorPicker';
import FormsSelect from './FormsSelect';
import FormsWysiwyg from './FormsWysiwyg';
import FormsMarkdown from './FormsMarkdown';
import ValueCM from './vcm';

export default {
    '/sign-in': AuthSignIn,
    '/sign-up': AuthSignUpClient,
    '/recuperar-password': RecuperarPassword,
    '/configurar-cuenta': ConfigurarNuevamente,

    '/': Dashboard,

    // Apps
    '/mailbox': Mailbox,
    '/messenger': Messenger,
    '/calendar': Calendar,
    '/project-management': ProjectManagement,
    '/task': Task,
    '/file-manager': FileManager,
    '/profile': Profile,
    '/digital': Digital,
    '/human': Human,
    '/revenue': Revenue,
    '/value': Value,

    // HCM - STAFF Y RECLUTAMIENTO
    '/staff': Staff,
    '/empresas': Empresas,
    '/editPerfilEmpresa': EditarPerfilEmpresa,
    '/usuarios': Usuarios,
    '/lineas': Lineas,
    '/Empleados': Empleados,
    '/listado-empresas': ListadoEmpresas,
    '/listado-perfiles': ListadoPerfiles,
    '/listado-publicaciones': ListadoPosiciones,
    '/listado-postulantes': ListadoPostulantes,
    '/crear-publicacion': StepperForm,
    '/editar-publicacion': StepperFormEdicion,

    // HCM - CLIENTE FEELROUK - SELECCIÓN
    '/listado-tags': TagsEnGeneral,
    '/agregar-pasos': VistaCargarPasos,
    '/proceso-seleccion': VistaPasosPublicacion,

    // Content
    '/grid': Grid,
    '/colors': Colors,
    '/typography': Typography,
    '/component-table': ComponentTable,
    
    //vcm
    '/vcm': ValueCM,
    '/vcm/*': ValueCM,
    
    // Components Base
    '/component-alert': ComponentAlert,
    '/component-badge': ComponentBadge,
    '/component-breadcrumbs': ComponentBreadcrumbs,
    '/component-button': ComponentButton,
    '/component-card': ComponentCard,
    '/component-carousel': ComponentCarousel,
    '/component-collapse': ComponentCollapse,
    '/component-dropdown': ComponentDropdown,
    '/component-list-group': ComponentListGroup,
    '/component-media-object': ComponentMediaObject,
    '/component-modal': ComponentModal,
    '/component-nav': ComponentNav,
    '/component-pagination': ComponentPagination,
    '/component-popover': ComponentPopover,
    '/component-progress': ComponentProgress,
    '/component-spinner': ComponentSpinner,
    '/component-tabs': ComponentTabs,

    // Components Advanced
    '/component-icons-feather': ComponentIconsFeather,
    '/component-icons-fontawesome': ComponentIconsFontAwesome,
    '/component-charts-chartjs': ComponentChartsChartJs,
    '/component-charts-chartist': ComponentChartsChartist,
    '/component-charts-peity': ComponentChartsPeity,
    '/component-charts-echarts': ComponentChartsEcharts,
    '/component-charts-flot': ComponentChartsFlot,
    '/component-timeline': ComponentTimeline,
    '/component-tree-view': ComponentTreeView,
    '/component-toast': ComponentToast,
    '/component-sweet-alert': ComponentSweetAlert,
    '/component-maps': ComponentMaps,
    '/component-data-tables': ComponentDataTables,

    // Forms Base
    '/forms-base': FormsBase,
    '/forms-datetime': FormsDateTimePicker,
    '/forms-validation': FormsValidation,
    '/forms-touch-spin': FormsTouchSpin,
    '/forms-range-slider': FormsRangeSlider,
    '/forms-input-masks': FormsInputMasks,
    '/forms-dropzone': FormsDropzone,
    '/forms-colorpicker': FormsColorPicker,
    '/forms-select': FormsSelect,
    '/forms-wysiwyg': FormsWysiwyg,
    '/forms-markdown': FormsMarkdown,
};
