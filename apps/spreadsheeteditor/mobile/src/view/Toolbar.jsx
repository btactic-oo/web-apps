import React, {Fragment, useEffect} from 'react';
import {NavLeft, NavRight, NavTitle, Link} from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
import EditorUIController from '../lib/patch'
import { useTranslation } from 'react-i18next';

const ToolbarView = props => {
    const isDisconnected = props.isDisconnected;
    const wsProps = props.wsProps;
    const focusOn = props.focusOn;
    const isShapeLocked = props.isShapeLocked;
    const undo_box = props.isEdit && EditorUIController.toolbarOptions ? EditorUIController.toolbarOptions.getUndoRedo({
            disabledUndo: !props.isCanUndo || isDisconnected,
            disabledRedo: !props.isCanRedo || isDisconnected,
            onUndoClick: props.onUndo,
            onRedoClick: props.onRedo
        }) : null;
    const docTitle = props.docTitle;
    const docTitleLength = docTitle.length;
    const isVersionHistoryMode = props.isVersionHistoryMode;
    const { t } = useTranslation();

    const correctOverflowedText = el => {
        if(el) {
            el.innerText = docTitle;

            if(el.scrollWidth > el.clientWidth) {
                const arrDocTitle = docTitle.split('.');
                const ext = arrDocTitle[1];
                const name = arrDocTitle[0];
                const diff = Math.floor(docTitleLength * el.clientWidth / el.scrollWidth - ext.length - 6);
                const shortName = name.substring(0, diff).trim();

                return `${shortName}...${ext}`;
            }

            return docTitle;
        }
    };

    useEffect(() => {
        if(!Device.phone) {
            const elemTitle = document.querySelector('.subnavbar .title');

            if (elemTitle) {
                elemTitle.innerText = correctOverflowedText(elemTitle);
            }
        }
    }, [docTitle]);

    return (
        <Fragment>
            <NavLeft>
                {(props.isShowBack && !isVersionHistoryMode) && <Link className={`btn-doc-back${props.disabledControls && ' disabled'}`} icon='icon-back' onClick={() => Common.Notifications.trigger('goback')}></Link>}
                {isVersionHistoryMode ? <a href="#" className='btn-close-history' onClick={(e) => {
                    e.preventDefault();
                    props.closeHistory();
                }}>{t("Toolbar.textCloseHistory")}</a> : null}
                {(Device.ios && !isVersionHistoryMode) && undo_box}
            </NavLeft>
            {(!Device.phone && !isVersionHistoryMode) && <NavTitle style={{width: '71%'}}>{props.docTitle}</NavTitle>}
            <NavRight>
                {(Device.android && !isVersionHistoryMode) && undo_box}
                {(props.showEditDocument && !isVersionHistoryMode) &&
                    <Link className={props.disabledControls ? 'disabled' : ''} icon='icon-edit' href={false} onClick={props.onEditDocument}></Link>
                }
                {(props.isEdit && EditorUIController.toolbarOptions && !isVersionHistoryMode) && EditorUIController.toolbarOptions.getEditOptions({
                    disabled: props.disabledEditControls || props.disabledControls || isDisconnected,
                    wsProps,
                    focusOn,
                    isShapeLocked,
                    onEditClick: () => props.openOptions('edit'),
                    onAddClick: () => props.openOptions('add')
                })}
                {Device.phone ? null : <Link className={(props.disabledControls || props.disabledSearch) && 'disabled'} icon='icon-search' searchbarEnable='.searchbar' href={false}></Link>}
                {props.displayCollaboration && window.matchMedia("(min-width: 360px)").matches && !isVersionHistoryMode ? <Link className={(props.disabledControls || props.disabledCollaboration) && 'disabled'} id='btn-coauth' href={false} icon='icon-collaboration' onClick={() => props.openOptions('coauth')}></Link> : null}
                {isVersionHistoryMode ? <Link id='btn-open-history' icon='icon-version-history' href={false} onClick={() => props.openOptions('history')}></Link> : null}
                <Link className={(props.disabledSettings || props.disabledControls || isDisconnected) && 'disabled'} id='btn-settings' icon='icon-settings' href={false} onClick={() => props.openOptions('settings')}></Link>
            </NavRight>
        </Fragment>
    )
};

export default ToolbarView;