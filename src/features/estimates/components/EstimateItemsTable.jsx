// tabela de itens reutilizada dentro do formulário

import {
  Box,
  IconButton,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export function EstimateItemsTable({ items, onChangeItem, onRemoveItem }) {
  const handleFieldChange = (index, field, value) => {
    onChangeItem(index, { ...items[index], [field]: value });
  };

  const calcLineTotal = (item) =>
    (item.quantity || 1) * (item.unitPrice || 0);

  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit price</TableCell>
            <TableCell align="right">Total</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                No items added yet.
              </TableCell>
            </TableRow>
          )}
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  select
                  size="small"
                  value={item.type || "service"}
                  onChange={(e) =>
                    handleFieldChange(index, "type", e.target.value)
                  }
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="service">Service</MenuItem>
                  <MenuItem value="product">Product</MenuItem>
                </TextField>
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  value={item.name || ""}
                  onChange={(e) =>
                    handleFieldChange(index, "name", e.target.value)
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.quantity || 1}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "quantity",
                      Number(e.target.value)
                    )
                  }
                  sx={{ width: 80 }}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={item.unitPrice || 0}
                  onChange={(e) =>
                    handleFieldChange(
                      index,
                      "unitPrice",
                      Number(e.target.value)
                    )
                  }
                  sx={{ width: 110 }}
                />
              </TableCell>
              <TableCell align="right">
                ${calcLineTotal(item).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onRemoveItem(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}