import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {Button, Card, CardActions, CardContent, CardHeader, Grid, LinearProgress, Paper, Table, TableCell, TableContainer, TableRow, TextField, withStyles} from '@material-ui/core';

import AppService from '../services/app.service';


const StyledTableCell = withStyles((theme) => ({
    root: {
      padding : '5px !important',
      borderLeft : '1px solid #d9d9d9'
    }
  }))(TableCell);
  const StyledTable = withStyles((theme) => ({
    root: {
      border : '2px solid #b3b3b3'
    }
  }))(Table);

const useStyles = makeStyles(() => ({
    mainCard: {
        height : '100%'
    },
    cardContent: {
        alignItems : 'center',
        overflowX : 'scroll'
    },
    gridContainer: {
      
    },
    tables: {
        display: 'inline-table'
    },
    cardActions :{
        display : 'block !important'
    }
}));

const MainView = (props) => {
    const classes = useStyles();
    
    const [filledSeats, setFilledSeats] = useState(null);
    const [totalSeats, setTotalSeats] = useState(0);
    const [showInput, setShowInput] = useState(true);
    const [rc, setRc] = useState(null);
    const [errorRc , setErrorRc] = useState(null);
    const [errorPass, setErrorPass] = useState(null);
    const [pass, setPass ] = useState();
    const [loading, setLoading] = useState(false);

    const reset = () => {
        setFilledSeats(null);
        setTotalSeats(null);
        setErrorRc(null); setRc(null);
        setErrorPass(null); setPass(null);
        setShowInput(true);
    }
    const fillSeats = async event => {
        if(rc == null || rc === undefined ){
        setErrorRc("Please enter rows & columns value"); 
        return;
        }
        if(pass == null || pass === undefined ){
        setErrorPass("Please valid no. of passenger"); 
        return;
        }
        try{
        var temp = [];
        JSON.parse(rc).forEach((arr) => temp.push(arr) );
        try {
            setLoading(true);
            
            let seats = await AppService.fillSeats(
                temp,
                pass
            );
            setFilledSeats(seats.seatsArrangement);
            setTotalSeats(seats.totalSeats);
            setShowInput(false);
            setLoading(false);
        } catch (e) {
            setLoading(false);
        } 
        }catch(e){
        setErrorRc("Please enter a valid 2D Integer array of dimn - int[n][2]");
        setRc(null); return;
        }
    };
    
    return (
    <Paper>
      <Card className={classes.mainCard} >
          <CardHeader title="Airplane seats" subheader="Fill the airplane seats based on the given algorithm"></CardHeader>
          {loading  && <LinearProgress /> }
          <CardContent className={classes.cardContent}>
            <Grid className={classes.gridContainer} container xs={12} spacing={1}>
                { showInput ? 
                 <>
                    <Grid item xs={6}>
                        <TextField
                            id="input-rc"
                            fullWidth
                            label="Enter Rows &amp; columns"
                            multiline
                            rowsMax={100}
                            value={rc}
                            onChange={(event) => {setRc(event.target.value); setErrorRc(null);}}
                            variant="filled"
                            error={errorRc!= null}
                            helperText={errorRc!= null ? errorRc : ''}
                            />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            id="input-pass"
                            fullWidth
                            label="Enter no of passengers"
                            value={pass}
                            type="number"
                            onChange={(event) => {setPass(event.target.value); setErrorPass(null)}}
                            variant="filled"
                            error = {errorPass != null}
                            helperText = {errorPass != null ? errorPass : ''}
                            />
                    </Grid>
                 </>
                 :
                 <>
                    { filledSeats !== null && filledSeats !==undefined &&  filledSeats.map((zones) => {
                        return (
                            <Grid xs={2}>
                                <TableContainer component={Paper}>
                                    <StyledTable className={classes.tables}> 
                                        {zones.map((rows) => {
                                            return(
                                            <TableRow>
                                            {rows.map((seat)=>{
                                                return(<StyledTableCell>{seat === 0 ? 'U' : seat}</StyledTableCell>)
                                            })}
                                            </TableRow>)
                                        })}
                                    </StyledTable> 
                                </TableContainer>
                            </Grid>
                        )})
                    }
                 </>
                }   
            </Grid>
            {!showInput && 
                <h5> Total No. of Seats: {totalSeats} <br/>
                No. of Seats filled: {pass} <br/>
                {pass > totalSeats &&  <>Passengers waiting with no seats : {pass-totalSeats} <br/></>}
                Input rows and columns : {rc} <br/>
                U - Unoccupied Seat
                </h5>
            }
          </CardContent>
          <CardActions className={classes.cardActions}>
              <Button color="primary" variant="contained" onClick={fillSeats}>
                  Click To fill
              </Button>
              <Button color="secondary" variant="contained" onClick={reset}>
                  Reset/Input
              </Button>
          </CardActions>
      </Card>
    </Paper>
    );
};

export default MainView;
