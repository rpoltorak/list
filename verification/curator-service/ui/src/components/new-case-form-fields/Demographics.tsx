import { Select, TextField } from 'formik-material-ui';

import { Autocomplete } from '@material-ui/lab';
import { Field } from 'formik';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import Scroll from 'react-scroll';
import { WithStyles } from '@material-ui/core/styles/withStyles';
import axios from 'axios';
import { createStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';

const styles = () =>
    createStyles({
        fieldRow: {
            marginBottom: '2em',
        },
        ageRow: {
            alignItems: 'baseline',
            display: 'flex',
        },
        ageField: {
            width: '8em',
        },
        ageSeparator: {
            margin: '0 2em',
        },
        select: {
            width: '8em',
        },
    });

type Props = WithStyles<typeof styles>;

// TODO: get values from DB.
const sexValues = [undefined, 'Male', 'Female'];

const ethnicityValues = [
    undefined,
    'Asian',
    'Black',
    'Latino',
    'Multi-race',
    'White',
    'Other',
];

class Demographics extends React.Component<Props, {}> {
    render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Scroll.Element name="demographics">
                <fieldset>
                    <legend>Demographics</legend>
                    <FormControl>
                        <div className={classes.fieldRow}>
                            <InputLabel htmlFor="sex">Sex</InputLabel>
                            <Field
                                as="select"
                                name="sex"
                                type="text"
                                data-testid="sex"
                                className={classes.select}
                                component={Select}
                            >
                                {sexValues.map((sex) => (
                                    <MenuItem
                                        key={sex ?? 'undefined'}
                                        value={sex}
                                    >
                                        {sex}
                                    </MenuItem>
                                ))}
                            </Field>
                        </div>
                    </FormControl>
                    <div className={`${classes.fieldRow} ${classes.ageRow}`}>
                        <Field
                            className={classes.ageField}
                            name="minAge"
                            type="number"
                            label="Min age"
                            component={TextField}
                        ></Field>
                        <span className={classes.ageSeparator}>to</span>
                        <Field
                            className={classes.ageField}
                            name="maxAge"
                            type="number"
                            label="Max age"
                            component={TextField}
                        ></Field>
                        <span className={classes.ageSeparator}>or</span>
                        <Field
                            className={classes.ageField}
                            name="age"
                            type="number"
                            label="Age"
                            component={TextField}
                        ></Field>
                    </div>
                    <div>
                        <FormControl>
                            <InputLabel htmlFor="ethnicity">
                                Ethnicity
                            </InputLabel>
                            <Field
                                as="select"
                                name="ethnicity"
                                type="text"
                                data-testid="ethnicity"
                                className={classes.select}
                                component={Select}
                            >
                                {ethnicityValues.map((ethnicity) => (
                                    <MenuItem
                                        key={ethnicity ?? 'undefined'}
                                        value={ethnicity}
                                    >
                                        {ethnicity}
                                    </MenuItem>
                                ))}
                            </Field>
                        </FormControl>
                    </div>
                    <Nationality />
                </fieldset>
            </Scroll.Element>
        );
    }
}

// Autocomplete for nationality.
// Based on https://material-ui.com/components/autocomplete/#asynchronous-requests.
function Nationality(): JSX.Element {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<string[]>([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async (): Promise<void> => {
            const resp = await axios.get<string>(
                'https://raw.githubusercontent.com/open-covid-data/healthmap-gdo-temp/master/suggest/nationalities.txt',
            );
            const nationalities = resp.data.split('\n');

            if (active) {
                setOptions(nationalities);
            }
        })();

        return (): void => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            itemType="string"
            open={open}
            onOpen={(): void => {
                setOpen(true);
            }}
            onClose={(): void => {
                setOpen(false);
            }}
            options={options}
            loading={loading}
            renderInput={(params): JSX.Element => (
                <Field
                    {...params}
                    name="nationality"
                    label="Nationality"
                    component={TextField}
                ></Field>
            )}
        />
    );
}

export default withStyles(styles)(Demographics);
