<?php

namespace OCTRU\REDCapDelphi;

use ExternalModules\AbstractExternalModule;

class REDCapDelphi
    extends AbstractExternalModule
{

    function redcap_data_entry_form ( int $project_id,
                                      string $record = NULL,
                                      string $instrument,
                                      int $event_id,
                                      int $group_id = NULL,
                                      int $repeat_instance = 1 ) {
        if ( (PAGE == 'DataEntry/index.php' && !empty($_GET['id']))
            ||
            (PAGE == 'surveys/index.php' && !empty($_GET['id']) )
        ) {
            $this->includeJs('scripts/echarts-5.5.6.min.js');
            $this->includeJs('scripts/delphi2.js');
            $this->process($project_id, $record);
        }
    }

    function redcap_survey_page ( $project_id, $record = NULL, $instrument, $event_id,
                                  $group_id = NULL, $survey_hash, $response_id = NULL, $repeat_instance = 1 ) {
        if ( (PAGE == 'DataEntry/index.php' && !empty($_GET['id']))
            ||
            (PAGE == 'surveys/index.php' && !empty($_GET['id']) )
        ) {
            $this->includeJs('scripts/echarts-5.5.6.min.js');
            $this->includeJs('scripts/delphi2.js');
            $this->process($project_id, $record);
        }
    }

     function process( $project_id, $record) {
        global $Proj;
        $hastag = false;

         $config = [
             'elements' => [],
         ];
        $tag = '@DELPHI';
        if ( $this->CheckForTags($Proj, $project_id, $record, $tag) ) {
            $hastag = true;
            $data = \REDCap::getData($Proj->project['project_id'], 'array', $_GET['id']);
            $fields = empty($_GET['page']) ? $Proj->metadata : $Proj->forms[$_GET['page']]['fields'];
            foreach (array_keys($fields) as $field_name) {
                $field_info = $Proj->metadata[$field_name];
                $misc = $field_info['misc'];
                $loc = strpos('__' . $misc . '__', $tag . '=');
                if ($loc > 0) {
                    //-- We have the tag that we need so remove any text before this.
                    $misc = trim(substr($misc, $loc + strlen($tag) -1));
                    //-- do we have another tag?
                    $loc = strpos($misc, '@');
                    if ( $loc > 0 ) {
                        $misc = trim(substr($misc, 0, $loc));
                    }
                    $params = json_decode(trim($misc), true);
                    $elmt = $field_name;
                    $displayType = 'single';
                    if ( array_key_exists('type', $params) ) {
                        $displayType = $params['type'];
                    }
                    $lastRoundVal = $params['preRound'];
                    if (preg_match_all('/(?:\[([a-z0-9][_a-z0-9]*)\])?\[([a-z][_a-zA-Z0-9:\(\)-]*)\](\[(\d+)\])?/',
                        $lastRoundVal,
                        $fieldMatches,
                        PREG_PATTERN_ORDER)) {
                        $event_id = $Proj->getEventIdUsingUniqueEventName($fieldMatches[1][0]);
                        if ( count($Proj->events) == 1) {
                            $event_id = array_keys($Proj->events[array_keys($Proj->events)[0]]['events'])[0];
                        }
                        $lastRoundVal = $data[$record][$event_id][$fieldMatches[2][0]];
                    }
                    //-- Now process groups
                    $groups = [];
                    $groups['prevscore'] = $lastRoundVal;
                    foreach( $params['groups'] as $grp) {
                        $groups['group'][] = ['name' => $grp['name'], "score" => $grp['score'], "colour" => $grp['colour']];
                    }
                    $config['elements'][$elmt]['type'] = $displayType;
                    $config['elements'][$elmt]['groups'] = $groups;
                }
            }
        }

        if ( $hastag ) {
            $this->setJsSettings($config);
        }
    }


    /***
     * @param $Proj -> The data we need
     * @param $project_id -> project id
     * @param $record -> record id
     * @param $actiontags -> The tags we are looking for
     * @return bool -> True/False if the tag is found
     */
    public function CheckForTags($Proj, $project_id, $record, $actiontags) {
        if ( is_null($Proj)
            || empty($project_id)
            || empty($record)
            || empty($actiontags)
        ) {
            return false;
        } else {
            //-- ================================================================== --//
            //-- Check if we have a field with the action tags we are interested in
            //-- ================================================================== --//
            $fields = empty($_GET['page']) ? $Proj->metadata : $Proj->forms[$_GET['page']]['fields'];
            foreach (array_keys($fields) as $field_name) {
                $field_info = $Proj->metadata[$field_name];
                $misc = $field_info['misc'];
                if (strpos('__' . $misc, $actiontags) > 0) {
                    return true;
                }
            }
            return false;
        }
    }

    protected function includeJs($path) {
        // For shib installations, it is necessary to use the API endpoint for resources
        global $auth_meth;
        $ext_path = $auth_meth == 'shibboleth' ? $this->getUrl($path, true, true) : $this->getUrl($path);
        echo '<script src="' . $ext_path . '"></script>';
    }
    protected function includeCSS($path) {
        // For shib installations, it is necessary to use the API endpoint for resources
        global $auth_meth;
        $ext_path = $auth_meth == 'shibboleth' ? $this->getUrl($path, true, true) : $this->getUrl($path);
        echo '<link rel="stylesheet" href=""' . $ext_path . '" />';
    }

    protected function setJsSettings($settings) {
        echo '<script>REDCapDelphi = ' . json_encode($this->escape($settings)) . ';</script>';
    }

}
