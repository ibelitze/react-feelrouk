/**
 * External Dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, FormGroup, Button } from 'reactstrap';

import { faEdit, faFile, faTrash, faCaretDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import DataTable from 'react-data-table-component';

/**
 * Component
 */
import ToggleButton from '../../components/toggle-button';

class Content extends Component {
    constructor( props ) {
        super( props );

        this.onEditorStateChange = this.onEditorStateChange.bind( this );
        this.handleChange = this.handleChange.bind( this );
        this.setSize = this.setSize.bind( this );
        this.renderingDataTable = this.renderingDataTable.bind( this );
        this.returnOptionsForEditor = this.returnOptionsForEditor.bind( this );

        this.state = {
            ok: false,
            permisos: null,
            dropdownOpen: false,
            dropdownOpen2: false,
            dropdownOpen3: false,
            dropdownOpen4: false,
            dropdownOpen5: false,
            dropdownOpen6: false,
            onEditorStateChange: false,
            editorState: EditorState.createEmpty(),
            checked: true,
            size: "default",
            disabled: false,
        };
    }

    handleChange( e ) {
        this.setState( { checked: e.target.checked } );
    }

    setSize() {
        this.setState( prevState => ( {
            size: prevState.size === "default" ? "large" : "default",
        } ) );
    }

    renderingDataTable() {
        const columns = [
            {
                name: 'Title',
                selector: row => row.title,
                sortable: true,
            },
            {
                name: 'Year',
                selector: row => row.year,
                sortable: true,
            },
        ];

        const data = [
            {
                id: 1,
                title: 'Beetlejuice',
                year: '1988',
            },
            {
                id: 2,
                title: 'Ghostbusters',
                year: '1984',
            },
        ];

        return (
            <DataTable
                columns={ columns }
                data={ data }
            />
        );
    }

    returnOptionsForEditor() {
        return (
            {
                options: [ 'inline', 'fontSize', 'list', 'textAlign', 'emoji', 'remove', 'history' ],
            }
        );
    }

    toggle( number ) {
        let state = null;
        switch ( number ) {
        case 1:
            state = ! this.state.dropdownOpen;
            this.setState( { dropdownOpen: state } );
            break;
        case 2:
            state = ! this.state.dropdownOpen2;
            this.setState( { dropdownOpen2: state } );
            break;
        case 3:
            state = ! this.state.dropdownOpen3;
            this.setState( { dropdownOpen3: state } );
            break;
        case 4:
            state = ! this.state.dropdownOpen4;
            this.setState( { dropdownOpen4: state } );
            break;
        case 5:
            state = ! this.state.dropdownOpen5;
            this.setState( { dropdownOpen5: state } );
            break;
        case 6:
            state = ! this.state.dropdownOpen6;
            this.setState( { dropdownOpen6: state } );
            break;
        default:
            break;
        }
    }

    onEditorStateChange( editorState ) {
        this.setState( {
            editorState,
        } );
    }

    render() {
        const { editorState } = this.state;
        const dataTable = this.renderingDataTable();
        const editorOptions = this.returnOptionsForEditor();
        return (
            <Fragment>
                <Row>
                    <Col lg="3" sm="12">
                        <h3 className="title-publicaciones">Publicaciones</h3>
                    </Col>
                </Row>
                <Row className="pb-30">
                    <Col lg="9">
                        <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen } toggle={ () => this.toggle( 1 ) }>
                            <DropdownToggle caret>
                                Seleccionar estado <FontAwesomeIcon icon={ faCaretDown } />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Estado 1</DropdownItem>
                                <DropdownItem>Estado 2</DropdownItem>
                                <DropdownItem>Estado 3</DropdownItem>
                                <DropdownItem>Estado 4</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen2 } toggle={ () => this.toggle( 2 ) }>
                            <DropdownToggle caret>
                                Ordenar por <FontAwesomeIcon icon={ faCaretDown } />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Estado 1</DropdownItem>
                                <DropdownItem>Estado 2</DropdownItem>
                                <DropdownItem>Estado 3</DropdownItem>
                                <DropdownItem>Estado 4</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen3 } toggle={ () => this.toggle( 3 ) }>
                            <DropdownToggle caret>
                                Lorem ipsum <FontAwesomeIcon icon={ faCaretDown } />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Estado 1</DropdownItem>
                                <DropdownItem>Estado 2</DropdownItem>
                                <DropdownItem>Estado 3</DropdownItem>
                                <DropdownItem>Estado 4</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen4 } toggle={ () => this.toggle( 4 ) }>
                            <DropdownToggle caret>
                                Lorem ipsum <FontAwesomeIcon icon={ faCaretDown } />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Estado 1</DropdownItem>
                                <DropdownItem>Estado 2</DropdownItem>
                                <DropdownItem>Estado 3</DropdownItem>
                                <DropdownItem>Estado 4</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        <Dropdown className="reclutamiento-dropdown" isOpen={ this.state.dropdownOpen5 } toggle={ () => this.toggle( 5 ) }>
                            <DropdownToggle caret>
                                Lorem ipsum <FontAwesomeIcon icon={ faCaretDown } />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>Estado 1</DropdownItem>
                                <DropdownItem>Estado 2</DropdownItem>
                                <DropdownItem>Estado 3</DropdownItem>
                                <DropdownItem>Estado 4</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>

                    <Col lg="3" className="d-flex flex-row-reverse">
                        <button className="btn btn-feelrouk2 justify-content-center">
                            <FontAwesomeIcon icon={ faPlus } /> Crear nuevo perfil
                        </button>
                    </Col>
                </Row>

                <Row className="justify-content-center pb-20">
                    <Col lg="3" className="flex justify-content-center">
                        <p>Ver</p>
                        <Dropdown className="cantidad-dropdown" isOpen={ this.state.dropdownOpen6 } toggle={ () => this.toggle( 6 ) }>
                            <DropdownToggle caret>
                                Cantidad <FontAwesomeIcon icon={ faCaretDown } />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>5</DropdownItem>
                                <DropdownItem>10</DropdownItem>
                                <DropdownItem>20</DropdownItem>
                                <DropdownItem>30</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <p>Perfiles</p>
                    </Col>

                    <Col lg="5"></Col>

                    <Col lg="4" className="flex justify-content-center">
                        <p>Buscar</p>
                        <Input type="text" />
                    </Col>
                </Row>
                <br></br>

                <Row className="justify-content-center">
                    <Col lg="12" sm="12">
                        <Table className="table-perfiles" striped>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Nivel de perfil</th>
                                    <th>Empresa</th>
                                    <th>Cargo</th>
                                    <th>Tipo de empleo</th>
                                    <th>Modalidad Laboral</th>
                                    <th>Ubicación del empleo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="fondo-gris">Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>
                                        <FontAwesomeIcon className="edit-svg" icon={ faEdit } /> 
                                        <FontAwesomeIcon className="mostrar-svg" icon={ faFile } /> 
                                        <FontAwesomeIcon className="trash-svg" icon={ faTrash } />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fondo-gris">Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>
                                        <FontAwesomeIcon className="edit-svg" icon={ faEdit } /> 
                                        <FontAwesomeIcon className="mostrar-svg" icon={ faFile } /> 
                                        <FontAwesomeIcon className="trash-svg" icon={ faTrash } />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fondo-gris">Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>
                                        <FontAwesomeIcon className="edit-svg" icon={ faEdit } /> 
                                        <FontAwesomeIcon className="mostrar-svg" icon={ faFile } /> 
                                        <FontAwesomeIcon className="trash-svg" icon={ faTrash } />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fondo-gris">Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>
                                        <FontAwesomeIcon className="edit-svg" icon={ faEdit } /> 
                                        <FontAwesomeIcon className="mostrar-svg" icon={ faFile } /> 
                                        <FontAwesomeIcon className="trash-svg" icon={ faTrash } />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fondo-gris">Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>
                                        <FontAwesomeIcon className="edit-svg" icon={ faEdit } /> 
                                        <FontAwesomeIcon className="mostrar-svg" icon={ faFile } /> 
                                        <FontAwesomeIcon className="trash-svg" icon={ faTrash } />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="fondo-gris">Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>Lorem ipsum</td>
                                    <td>
                                        <FontAwesomeIcon className="edit-svg" icon={ faEdit } /> 
                                        <FontAwesomeIcon className="mostrar-svg" icon={ faFile } /> 
                                        <FontAwesomeIcon className="trash-svg" icon={ faTrash } />
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <br></br>
                <br></br>
                <br></br>

                <Row>

                    <Col lg="6" sm="12">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Pellentesque commodo auctor lectus at lacinia. Praesent non vestibulum sapien. 
                            Vivamus at sapien commodo, ultrices arcu ac
                        </p>

                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Input type="text" className="input-hcm-formulario" placeholder="Nombre" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <Dropdown className="formulario-hcm-dropdown" isOpen={ this.state.dropdownOpen5 } toggle={ () => this.toggle( 5 ) }>
                                    <DropdownToggle caret>
                                        Nivel de perfil <FontAwesomeIcon icon={ faCaretDown } />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Estado 1</DropdownItem>
                                        <DropdownItem>Estado 2</DropdownItem>
                                        <DropdownItem>Estado 3</DropdownItem>
                                        <DropdownItem>Estado 4</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col> 
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup>
                                    <Input type="text" className="input-hcm-formulario" placeholder="Empresa" />
                                </FormGroup>
                            </Col>
                            <Col md="6">
                                <FormGroup>
                                    <Input type="text" className="input-hcm-formulario" placeholder="Cargo" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Dropdown className="formulario-hcm-dropdown" isOpen={ this.state.dropdownOpen5 } toggle={ () => this.toggle( 5 ) }>
                                    <DropdownToggle caret>
                                        Tipo de empleo <span className="punto-naranja">*</span> <FontAwesomeIcon icon={ faCaretDown } />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Estado 1</DropdownItem>
                                        <DropdownItem>Estado 2</DropdownItem>
                                        <DropdownItem>Estado 3</DropdownItem>
                                        <DropdownItem>Estado 4</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col>
                            <Col md="6">
                                <Dropdown className="formulario-hcm-dropdown" isOpen={ this.state.dropdownOpen5 } toggle={ () => this.toggle( 5 ) }>
                                    <DropdownToggle caret>
                                        Modalidad Laboral <span className="punto-naranja">*</span> <FontAwesomeIcon icon={ faCaretDown } />
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem>Estado 1</DropdownItem>
                                        <DropdownItem>Estado 2</DropdownItem>
                                        <DropdownItem>Estado 3</DropdownItem>
                                        <DropdownItem>Estado 4</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Col> 
                        </Row>
                        <Row>
                            <Col md="6">
                                <FormGroup className="mt-10">
                                    <Input type="text" className="input-hcm-formulario" placeholder="Ubicación del empleo" />
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="justify-content-end">

                            <Col md="6" className="align-elements-right">
                                <Button className="btn-feelrouk-naranja2">SIGUIENTE</Button>
                            </Col>
                
                        </Row>
                    </Col>
                    <Col lg="6" sm="12">
                        <Row>
                            <Col lg="6" className="recuadro-info-formulario">
                                <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h3>
                                <p>
                                    Morbi mattis maximus tortor, quis maximus dolor malesuada id. 
                                    Sed sit amet ex mattis, sagittis orci maximus, facilisis ipsum. Proin fermentum, est sed convallis accumsan
                                </p>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Col lg="4">
                        <Row>
                            <Col lg="6" sm="12" xs="12">
                                <div className="recuadro-hcm-modulo">
                                    <Col md="6" className="container-flex">
                                        <img src={ this.props.settings.img_feelrouk.hcm_modulo } alt={ "Imagen para modulo HCM" } />
                                    </Col>
                                    <Col md="6">
                                        <div className="content-div">
                                            <h2 className="titulo-blanco">HUMAN CAPITAL</h2>
                                            <h2 className="titulo-naranja">MANAGEMENT</h2>
                                            <Button className="btn-feelrouk-naranja2">ABRIR</Button>
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                            <Col lg="6" sm="12" xs="12">
                                <div className="recuadro-hcm-modulo">
                                    <Col md="6" className="container-flex">
                                        <img src={ this.props.settings.img_feelrouk.hcm_modulo } alt={ "Imagen para modulo HCM" } />
                                    </Col>
                                    <Col md="6">
                                        <div className="content-div">
                                            <h2 className="titulo-blanco">HUMAN CAPITAL</h2>
                                            <h2 className="titulo-naranja">MANAGEMENT</h2>
                                            <Button className="btn-feelrouk-naranja2">ABRIR</Button>
                                        </div>
                                    </Col>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <br></br>
                <Row>
                    <Editor
                        editorState={ editorState }
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={ this.onEditorStateChange }
                        toolbar={ editorOptions }
                    />
                </Row>
                <br></br><br></br>
                <Row>
                    <div className="testing"></div>
                </Row>
                <br></br>
                <Row>
                    <Col lg="4">
                        <ToggleButton
                            checked={ this.state.checked }
                            text="Switch de ejemplo"
                            size={ this.state.size }
                            disabled={ this.state.disabled }
                            onChange={ this.handleChange }
                            offstyle="btn-danger"
                            onstyle="btn-success"
                        />
                    </Col>
                </Row>
                <br></br>
                <Row>
                    { dataTable } 
                </Row>
            </Fragment>
        );
    }
}

export default connect( ( { settings, info } ) => (
    {
        settings,
        info,
    }
) )( Content );
