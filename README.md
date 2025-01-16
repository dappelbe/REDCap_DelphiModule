# REDCap Delphi

This module facilitates Delphi surveys in REDCap by adding a mechanism to display the results of a previous round
by stakeholder group and pre-populates a radio button group with the participants answer from a previous round.

![An example of how the display is changed](Documents/img01.png)

## ToDo
- Change the display to show a distribution of all answers for this question.
- Auto calculate the values to display

# Setup
Install the module from REDCap module repository and enable over Control Center.

# Configuration
- The Round 1 Delphi survey must use radio buttons to collect the answer.
- You should extract the data and calculate the mean value for each stakeholder group that you wish to display
- The Delphi survey that you wish to use this module on, must also ask the questions using radio buttons.
- For each question in the Delphi survey use the following annotation:

```
@DELPHI={
        "preRound":"[event_1_arm_1][delphi01_q02]",
        "groups":[
            {"name":"Group 1","score":"9","colour":"#0000FF"},
            {"name":"Group 2","score":"8","colour":"#0000FF"}
            ]
       }
```

where:

| key | description                                                                                                  | Example |
| --- |--------------------------------------------------------------------------------------------------------------| ------- |
| preRound | The field in the previous round holding the participants score to this question in the format [event][field] | [event_1_arm_1][delphi01_q02] |
| groups | An array of the stakeholder groups, score to be assigned and colour to display the score in.                 | [{"name":"Group 1","score":"9","colour":"#0000FF"},{"name":"Group 2","score":"8","colour":"#0000FF"}] |
| name | The name of the stakeholder group, used as a label in the table of previous scores.                          | Group 1 |
| score | The average score to display (this should be in the same range as that used for the radiobutton list)        | 8 |
| colour | The colour to fill the table cell in with, as a HEX code | #0000FF |

# Changelog

| Version | Date | Description |
| ------- | ---- | ----------- |
| 1.0 | 16 Jan 2024 | Intial release |
