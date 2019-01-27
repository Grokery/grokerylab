import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const className = require('classnames');
const debounce = require('lodash.debounce');
const isEqual = require('lodash.isequal');

require('codemirror/lib/codemirror.css')
require('codemirror/mode/xml/xml')
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/css/css')
require('codemirror/mode/htmlmixed/htmlmixed')

require('codemirror/mode/sql/sql')

class CodeMirror extends Component {
	/*
		I've copied substantial paortions of Jed Watson's excelent React
		CodeMirror component available from npm under the following license:

		The MIT License (MIT)

		Copyright (c) 2016 Jed Watson

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in all
		copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
		SOFTWARE.

	 */
    static propTypes = {
        autoFocus: PropTypes.bool,
        className: PropTypes.any,
        codeMirrorInstance: PropTypes.func,
        defaultValue: PropTypes.string,
        name: PropTypes.string,
        onChange: PropTypes.func,
        onCursorActivity: PropTypes.func,
        onFocusChange: PropTypes.func,
        onScroll: PropTypes.func,
        options: PropTypes.object,
        path: PropTypes.string,
        value: PropTypes.string,
		preserveScrollPosition: PropTypes.bool,
    }
    static defaultProps = {
		preserveScrollPosition: false,
    }
    constructor(props) {
        super(props)
        this.state = {
            isFocused: false
        }
    }
    getCodeMirrorInstance () {
        return this.props.codeMirrorInstance || require('codemirror')
    }
    componentWillMount() {
        this.componentWillReceiveProps = debounce(this.componentWillReceiveProps, 0);
    }
    componentDidMount() {
		const codeMirrorInstance = this.getCodeMirrorInstance()
		this.codeMirror = codeMirrorInstance.fromTextArea(this.textareaNode, this.props.options)
		this.codeMirror.on('change', this.codemirrorValueChanged.bind(this))
		this.codeMirror.on('cursorActivity', this.cursorActivity.bind(this))
		this.codeMirror.on('focus', this.focusChanged.bind(this, true))
		this.codeMirror.on('blur', this.focusChanged.bind(this, false))
		this.codeMirror.on('scroll', this.scrollChanged.bind(this))
		this.codeMirror.setValue(this.props.defaultValue || this.props.value || '')
	}
	componentWillUnmount() {
		if (this.codeMirror) {
			this.codeMirror.toTextArea()
		}
	}
    componentWillReceiveProps(nextProps) {
		if (this.codeMirror && nextProps.value !== undefined && this.normalizeLineEndings(this.codeMirror.getValue()) !== this.normalizeLineEndings(nextProps.value)) {
			if (this.props.preserveScrollPosition) {
				var prevScrollPosition = this.codeMirror.getScrollInfo()
				this.codeMirror.setValue(nextProps.value)
				this.codeMirror.scrollTo(prevScrollPosition.left, prevScrollPosition.top)
			} else {
				this.codeMirror.setValue(nextProps.value)
			}
		}
		if (typeof nextProps.options === 'object') {
			for (let optionName in nextProps.options) {
				if (nextProps.options.hasOwnProperty(optionName)) {
					this.setOptionIfChanged(optionName, nextProps.options[optionName])
				}
			}
		}
	}
    normalizeLineEndings(str) {
        if (!str) return str;
        return str.replace(/\r\n|\r/g, '\n')
    }
	setOptionIfChanged(optionName, newValue) {
 		const oldValue = this.codeMirror.getOption(optionName)
 		if (!isEqual(oldValue, newValue)) {
 			this.codeMirror.setOption(optionName, newValue)
 		}
 	}
	getCodeMirror() {
		return this.codeMirror
	}
	focus() {
		if (this.codeMirror) {
			this.codeMirror.focus()
		}
	}
	focusChanged(focused) {
		this.setState({
			isFocused: focused
		});
		return this.props.onFocusChange && this.props.onFocusChange(focused)
	}
	cursorActivity(cm) {
		return this.props.onCursorActivity && this.props.onCursorActivity(cm)
	}
	scrollChanged(cm) {
		return this.props.onScroll && this.props.onScroll(cm.getScrollInfo())
	}
	codemirrorValueChanged(doc, change) {
		if (this.props.onChange && change.origin !== 'setValue') {
			this.props.onChange(doc.getValue(), change)
		}
	}
    render() {
		const editorClassName = className(
			'ReactCodeMirror',
			this.state.isFocused ? 'ReactCodeMirror--focused' : null,
			this.props.className
		)
		return (
			<div className={editorClassName}>
				<textarea
					ref={ref => this.textareaNode = ref}
					name={this.props.name || this.props.path}
					defaultValue={this.props.value}
					autoComplete="off"
					autoFocus={this.props.autoFocus}
				/>
			</div>
		)
    }
}

const mapStateToProps = (state, ownProps) => {
    return {}
}

export default connect(mapStateToProps, {})(CodeMirror)
