/**
 * Styles
 */
import './style.scss';

/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { Label } from 'reactstrap';

/**
 * Component
 */
class ToggleButton extends Component {
    render() {
        // const {
        //     text,
        //     size = "default",
        //     checked,
        //     disabled,
        //     onChange,
        //     offstyle = "btn-danger",
        //     onstyle = "btn-success",
        // } = this.props;
        const {
            text,
            size = "default",
            checked,
            disabled,
            onChange,
            onstyle = "btn-success",
        } = this.props;

        return (
            <>
                <Label>
                    <span className={ `${ size } switch-wrapper` }>
                        <input
                            type="checkbox"
                            checked={ checked }
                            disabled={ disabled }
                            onChange={ e => onChange( e ) }
                        />
                        <span className={ `${ onstyle } switch` }>
                            <span className="switch-handle" />
                        </span>
                    </span>
                    <span className="switch-label">{ text }</span>
                </Label>
            </>
        );
    }
}

export default ToggleButton;
