<?php

/**
 * Tag - a content-tagging module for the Zikukla Application Framework
 * 
 * @license MIT
 *
 * Please see the NOTICE file distributed with this source code for further
 * information regarding copyright and licensing.
 */
class Tag_Handlers
{

    public static function getTypes(Zikula_Event $event)
    {
        $types = $event->getSubject();
        $types->add('Tag_ContentType_TagCloud');
    }

    /**
     * add Tag/templates/plugins to core template search in order to
     * make Tag template plugins available to any module.
     * Specifically, the displaytags.php plugin.
     *
     * @param   object $event
     * @return  null
     */
    public static function registerPluginDir(Zikula_Event $event)
    {
        $modinfo = ModUtil::getInfoFromName('Tag');
        if (!$modinfo) {
            return;
        }
        $view = $event->getSubject();
        $view->addPluginDir("modules/$modinfo[directory]/templates/plugins");
    }

}