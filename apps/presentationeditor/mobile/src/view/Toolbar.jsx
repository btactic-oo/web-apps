import React, {Fragment, useEffect} from 'react';
import {NavLeft, NavRight, NavTitle, Link} from 'framework7-react';
import { Device } from '../../../../common/mobile/utils/device';
import EditorUIController from '../lib/patch'
import { useTranslation } from 'react-i18next';

const ToolbarView = props => {
    const { t } = useTranslation();
    const isDisconnected = props.isDisconnected;
    const docTitle = props.docTitle;
    const docTitleLength = docTitle.length;
    const isVersionHistoryMode = props.isVersionHistoryMode;
    const isOpenModal = props.isOpenModal;

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
                {(props.isShowBack && !isVersionHistoryMode) && <Link className={`btn-doc-back${(props.disabledControls || isOpenModal) && ' disabled'}`} icon='icon-back' onClick={() => Common.Notifications.trigger('goback')}></Link>}
                {isVersionHistoryMode ? <a href="#" className='btn-close-history' onClick={(e) => {
                    e.preventDefault();
                    props.closeHistory();
                }}>{t("Toolbar.textCloseHistory")}</a> : null}
                {(Device.ios && props.isEdit && !isVersionHistoryMode) && EditorUIController.getUndoRedo && EditorUIController.getUndoRedo({
                    disabledUndo: !props.isCanUndo || isDisconnected,
                    disabledRedo: !props.isCanRedo || isDisconnected,
                    onUndoClick: props.onUndo,
                    onRedoClick: props.onRedo
                })}
            </NavLeft>
            {(!Device.phone && !isVersionHistoryMode) && 
                <div className='title' onClick={() => props.changeTitleHandler()} style={{width: '71%'}}>
                    {props.docTitle}
                </div>
            }
            {/* <NavTitle onClick={() => props.changeTitleHandler()} style={{width: '71%'}}>{props.docTitle}</NavTitle>} */}
            <NavRight>
                {(Device.android && props.isEdit && EditorUIController.getUndoRedo && !isVersionHistoryMode) && EditorUIController.getUndoRedo({
                    disabledUndo: !props.isCanUndo || isDisconnected,
                    disabledRedo: !props.isCanRedo || isDisconnected,
                    onUndoClick: props.onUndo,
                    onRedoClick: props.onRedo
                })}
                {!isVersionHistoryMode &&
                    <Link className={(props.disabledControls || props.disabledPreview || isOpenModal) && 'disabled'} icon='icon-play' href={false} onClick={() => {props.openOptions('preview')}}></Link>
                }
                {(props.showEditDocument && !isVersionHistoryMode) &&
                    <Link className={(props.disabledControls || isOpenModal) ? 'disabled' : ''} icon='icon-edit' href={false} onClick={props.onEditDocument}></Link>
                }
                {(props.isEdit && EditorUIController.getToolbarOptions && !isVersionHistoryMode) && EditorUIController.getToolbarOptions({
                    disabledEdit: props.disabledEdit || props.disabledControls || isDisconnected || props.disabledPreview || isOpenModal,
                    disabledAdd: props.disabledControls || isDisconnected || isOpenModal,
                    onEditClick: () => props.openOptions('edit'),
                    onAddClick: () => props.openOptions('add')
                })}
                {Device.phone ? null : <Link className={(props.disabledControls || props.disabledPreview || isOpenModal) && 'disabled'} icon='icon-search' searchbarEnable='.searchbar' href={false}></Link>}
                {props.displayCollaboration && window.matchMedia("(min-width: 375px)").matches && !isVersionHistoryMode ? <Link className={(props.disabledControls || isOpenModal) && 'disabled'} id='btn-coauth' href={false} icon='icon-collaboration' onClick={() => props.openOptions('coauth')}></Link> : null}
                {isVersionHistoryMode ? <Link id='btn-open-history' icon='icon-version-history' href={false} className={isOpenModal && 'disabled'} onClick={() => props.openOptions('history')}></Link> : null}
                <Link className={(props.disabledSettings || props.disabledControls || isDisconnected || isOpenModal) && 'disabled'} id='btn-settings' icon='icon-settings' href={false} onClick={() => props.openOptions('settings')}></Link>
            </NavRight>
        </Fragment>
    )
};

export default ToolbarView;